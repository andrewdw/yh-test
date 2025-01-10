import express, { Request, Response } from 'express';
import knex from 'knex';
import knexConfig from './knexfile';
import { Cuisine, Menu, SetMenusResponse } from '../types/api.types';
import { DB_Cuisine, DB_SetMenu } from '../types/db.types';
// init knex
const db = knex(knexConfig.development);

// init express
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/set-menus', async (req: Request, res: Response) => {
  try {
    // start performance timer
    const start = performance.now();
    const { cuisineSlug, page = 1, pageSize = 10 } = req.query;
    const slug = cuisineSlug ?? '';

    // calculate offset for pagination
    const offset = (Number(page) - 1) * Number(pageSize);

    // build query to get filtered set menus
    const setMenusQuery = db('set_menus')
      .select(
        'set_menus.name',
        'set_menus.description',
        'set_menus.price_per_person',
        'set_menus.min_spend',
        'set_menus.thumbnail',
        'set_menus.number_of_orders',
        // build cuisines array -- easier than setting aliases and looping through the results
        db.raw('json_agg(json_build_object(\'name\', cuisines.name, \'slug\', cuisines.slug)) as cuisines')
      )
      // join set_menu_cuisines and cuisine tables
      .join('set_menu_cuisines', 'set_menus.id', 'set_menu_cuisines.set_menu_id')
      .join('cuisines', 'set_menu_cuisines.cuisine_id', 'cuisines.id')
      .where('set_menus.status', 1)
      .modify((queryBuilder) => {
        if (slug) {
          queryBuilder.where('cuisines.slug', slug);
        }
      })
      .groupBy('set_menus.id')
      .orderBy('set_menus.number_of_orders', 'desc')
      .limit(Number(pageSize))
      .offset(offset);

    // get set menus
    const setMenus = await setMenusQuery;

    // build query to get cuisine filters
    const cuisineFiltersQuery = db('cuisines')
      .select(
        'cuisines.name',
        'cuisines.slug',
        // get number of orders for each cuisine
        db.raw('SUM(set_menus.number_of_orders) as number_of_orders'),
        // get number of set menus for each cuisine (that have a live status)
        db.raw(
          'COUNT(set_menus.id) FILTER (WHERE set_menus.status = 1) as set_menus_count'
        )
      )
      .join('set_menu_cuisines', 'cuisines.id', 'set_menu_cuisines.cuisine_id')
      .join('set_menus', 'set_menu_cuisines.set_menu_id', 'set_menus.id')
      .groupBy('cuisines.id')
      // sort by aggregate number of orders
      .orderBy('number_of_orders', 'desc');

    // get cuisine filters
    const cuisineFilters = await cuisineFiltersQuery;

    // construct response
    const response: SetMenusResponse = {
      filters: {
        cuisines: cuisineFilters.map((cuisine: DB_Cuisine) => ({
          name: cuisine.name,
          slug: cuisine.slug,
          number_of_orders: Number(cuisine.number_of_orders),
          set_menus_count: Number(cuisine.set_menus_count),
        })),
      },
      setMenus: setMenus.map((menu: DB_SetMenu) => ({
        name: menu.name,
        description: menu.description,
        price: menu.price_per_person,
        minSpend: menu.min_spend,
        thumbnail: menu.thumbnail,
        cuisines: menu.cuisines.map((cuisine: DB_Cuisine) => ({
          name: cuisine.name,
          slug: cuisine.slug,
        })),
      })),
    };

    // end performance timer
    const end = performance.now();
    console.log(`Time taken: ${Math.round(end - start)} milliseconds`);

    // send response
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
