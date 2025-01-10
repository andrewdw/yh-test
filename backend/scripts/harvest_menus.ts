import { Knex, knex } from 'knex';
import axios from 'axios';
import { ApiResponse, Cuisine, SetMenu } from '../../types/menu.types';
import { TABLE_NAME_CUISINE, TABLE_NAME_SET_MENU, TABLE_NAME_SET_MENU_CUISINE, TABLE_NAME_MENU_GROUP, TABLE_NAME_GROUP } from '../constants';
import knexConfig from '../knexfile';

const db: Knex = knex(knexConfig.development);

const BASE_URL = 'https://staging.yhangry.com/booking/test/set-menus';
const RATE_LIMIT_MS = 1000; // 1 request per second

// utility function to sleep for a given number of milliseconds
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// utility function to slugify a string
function slugify(input: string): string {
  return input
    .trim() // trim whitespace
    .toLowerCase() // convert to lowercase
    .replace(/[^a-z0-9\s-]/g, '') // remove non-alphanumeric characters (except spaces and hyphens)
    .replace(/\s+/g, '-'); // replace spaces with hyphens
}

async function fetchPage(page: number): Promise<ApiResponse | null> {
  try {
    const response = await axios.get<ApiResponse>(`${BASE_URL}?page=${page}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching page ${page}:`, error instanceof Error ? error.message : error);
    return null;
  }
}

async function storeCuisine(trx: Knex.Transaction, cuisine: Cuisine): Promise<void> {
  // check if the cuisine already exists
  const existingCuisine = await trx(TABLE_NAME_CUISINE)
    .select('id')
    .where('id', cuisine.id)
    .first();

  if (existingCuisine) {
    return;
  }
  // if the cuisine does not exist, create a new one
  await trx(TABLE_NAME_CUISINE)
    .insert({
      id: cuisine.id,
      name: cuisine.name,
      slug: slugify(cuisine.name)
    })
    .onConflict('id')
    .merge();
}

async function storeGroup(trx: Knex.Transaction, groupName: string): Promise<number> {
  // check if the group already exists
  const existingGroup = await trx(TABLE_NAME_GROUP)
    .select('id')
    .where('name', groupName)
    .first();

  if (existingGroup) {
    return existingGroup.id;
  }
  // if the group does not exist, create a new one
  const [newGroup] = await trx(TABLE_NAME_GROUP)
    .insert({
      name: groupName
    })
    .returning('id');
  return newGroup.id;
}

async function storeSetMenu(menu: SetMenu): Promise<void> {
  // start transaction
  await db.transaction(async (trx) => {
    try {
      // create the set menu
      const result = await trx(TABLE_NAME_SET_MENU)
        .insert({
          created_at: menu.created_at,
          description: menu.description,
          display_text: menu.display_text ?? 0,
          image: menu.image,
          thumbnail: menu.thumbnail,
          is_vegan: menu.is_vegan ?? 0,
          is_vegetarian: menu.is_vegetarian ?? 0,
          name: menu.name,
          status: menu.status ?? 1,
          price_per_person: menu.price_per_person ?? 0,
          min_spend: menu.min_spend ?? 0,
          is_seated: menu.is_seated ?? 0,
          is_standing: menu.is_standing ?? 0,
          is_canape: menu.is_canape ?? 0,
          is_mixed_dietary: menu.is_mixed_dietary ?? 0,
          is_meal_prep: menu.is_meal_prep ?? 0,
          is_halal: menu.is_halal ?? 0,
          is_kosher: menu.is_kosher ?? 0,
          price_includes: menu.price_includes,
          highlight: menu.highlight,
          available: menu.available ?? true,
          number_of_orders: menu.number_of_orders ?? 0,
          group_dishes_count: menu.groups?.dishes_count ?? 0,
          group_selectable_dishes_count: menu.groups?.selectable_dishes_count ?? 0
        })
        .returning('id');
      // get the id of the new set menu
      const menuId = result[0].id;

      // store the cuisines if they exist
      if (menu.cuisines) {
        for (const cuisine of menu.cuisines) {
          // store the cuisine
          await storeCuisine(trx, cuisine);
          // store the set menu cuisine
          await trx(TABLE_NAME_SET_MENU_CUISINE)
            .insert({
              set_menu_id: menuId,
              cuisine_id: cuisine.id,
            })
            .onConflict(['set_menu_id', 'cuisine_id'])
            .ignore();
        }
      }

      // store the groups if they exist
      if (menu.groups?.groups) {
        for (const [groupName, active] of Object.entries(menu.groups.groups)) {
          if (groupName !== 'ungrouped' && active === 1) {
            const groupId = await storeGroup(trx, groupName);
            await trx(TABLE_NAME_MENU_GROUP)
              .insert({
                set_menu_id: menuId,
                group_id: groupId
              })
              .onConflict(['set_menu_id', 'group_id'])
              .ignore();
          }
        }
      }
    } catch (error) {
      console.error(`Error storing menu ${menu.name}:`, error instanceof Error ? error.message : error);
      throw error;
    }
  });
}

async function harvestData(): Promise<void> {
  try {
    let page = 1;
    let hasMorePages = true;

    // loop through the pages
    while (hasMorePages) {
      console.log(`Fetching page ${page}...`);
      const data = await fetchPage(page);
      // if the page does not exist, stop the process
      if (!data) {
        console.error(`Failed to fetch page ${page}, stopping.`);
        break;
      }
      // loop through the menus
      for (const menu of data.data) {
        try {
          await storeSetMenu(menu);
          console.log(`Stored menu: ${menu.name}`);
        } catch (error) {
          console.error(`Failed to store menu ${menu.name}:`, error instanceof Error ? error.message : error);
          // continue with next menu instead of stopping the entire process
          continue;
        }
      }

      hasMorePages = data.links.next !== null;
      page++;

      // respect rate limit
      await sleep(RATE_LIMIT_MS);
    }

    console.log('Data harvest completed successfully!');
  } catch (error) {
    console.error('Error during data harvest:', error instanceof Error ? error.message : error);
  } finally {
    await db.destroy();
  }
}

// run the script
harvestData();