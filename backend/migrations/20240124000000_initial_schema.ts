import { Knex } from 'knex';
import {
  TABLE_NAME_CUISINE,
  TABLE_NAME_SET_MENU,
  TABLE_NAME_SET_MENU_CUISINE,
  TABLE_NAME_MENU_GROUP,
  TABLE_NAME_GROUP,
} from "../constants";

export async function up(knex: Knex): Promise<void> {
  // cuisines table
  await knex.schema.createTable(TABLE_NAME_CUISINE, (table) => {
    table.increments("id").primary();
    table.string("name").notNullable().unique();
    table.string("slug").notNullable().index();
  });

  // set_menus table
  await knex.schema.createTable(TABLE_NAME_SET_MENU, (table) => {
    table.increments("id").primary();
    table.text("description").nullable();
    table.integer("display_text").unsigned().notNullable().defaultTo(0);
    table.text("image").nullable();
    table.text("thumbnail").nullable();
    table.integer("is_vegan").unsigned().notNullable().defaultTo(0);
    table.integer("is_vegetarian").unsigned().notNullable().defaultTo(0);
    table.string("name").notNullable();
    table.integer("status").unsigned().notNullable().defaultTo(1);
    table.integer("price_per_person").unsigned().notNullable().defaultTo(0);
    table.integer("min_spend").unsigned().notNullable().defaultTo(0);
    table.integer("is_seated").unsigned().notNullable().defaultTo(0);
    table.integer("is_standing").unsigned().notNullable().defaultTo(0);
    table.integer("is_canape").unsigned().notNullable().defaultTo(0);
    table.integer("is_mixed_dietary").unsigned().notNullable().defaultTo(0);
    table.integer("is_meal_prep").unsigned().notNullable().defaultTo(0);
    table.integer("is_halal").unsigned().notNullable().defaultTo(0);
    table.integer("is_kosher").unsigned().notNullable().defaultTo(0);
    table.text("price_includes").nullable();
    table.text("highlight").nullable();
    table.boolean("available").notNullable().defaultTo(true);
    table.integer("number_of_orders").unsigned().notNullable().defaultTo(0);
    table.timestamps(true, true);
    // group -- unsure as of yet if this is an aggregate or not
    table.integer("group_dishes_count").unsigned().notNullable().defaultTo(0);
    table.integer("group_selectable_dishes_count").unsigned().notNullable().defaultTo(0);

    // since a lot of columns are booleans masquerading as integers, we'll add some check constraints
    // to ensure the integers are only 0 or 1 where applicable and can remove them if needed (e.g status needs to also be 0, 1, or 2)
    table.check(`"display_text" IN (0, 1)`);
    table.check(`"is_vegan" IN (0, 1)`);
    table.check(`"is_vegetarian" IN (0, 1)`);
    table.check(`"status" IN (0, 1)`);
    table.check(`"is_seated" IN (0, 1)`);
    table.check(`"is_standing" IN (0, 1)`);
    table.check(`"is_canape" IN (0, 1)`);
    table.check(`"is_mixed_dietary" IN (0, 1)`);
    table.check(`"is_meal_prep" IN (0, 1)`);
    table.check(`"is_halal" IN (0, 1)`);
    table.check(`"is_kosher" IN (0, 1)`);
  });

  // set_menu_cuisines table (many-to-many relationship between set_menus and cuisines)
  await knex.schema.createTable(TABLE_NAME_SET_MENU_CUISINE, (table) => {
    table
      .integer("set_menu_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable(TABLE_NAME_SET_MENU)
      .onDelete("CASCADE");
    table
      .integer("cuisine_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable(TABLE_NAME_CUISINE)
      .onDelete("CASCADE");
    table.primary(["set_menu_id", "cuisine_id"]);
  });

  // groups table
  await knex.schema.createTable(TABLE_NAME_GROUP, (table) => {
    table.increments("id").primary();
    table.string("name").notNullable().index().unique();
  });

  // menu_groups table (many-to-many relationship between set_menus and groups)
  await knex.schema.createTable(TABLE_NAME_MENU_GROUP, (table) => {
    table
      .integer("set_menu_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable(TABLE_NAME_SET_MENU)
      .onDelete("CASCADE");
    table
      .integer("group_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable(TABLE_NAME_GROUP)
      .onDelete("CASCADE");
    table.primary(["set_menu_id", "group_id"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(TABLE_NAME_MENU_GROUP);
  await knex.schema.dropTableIfExists(TABLE_NAME_SET_MENU_CUISINE);
  await knex.schema.dropTableIfExists(TABLE_NAME_SET_MENU);
  await knex.schema.dropTableIfExists(TABLE_NAME_CUISINE);
  await knex.schema.dropTableIfExists(TABLE_NAME_GROUP);
}
