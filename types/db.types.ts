export type DB_Cuisine = {
  id: number;
  name: string;
  slug: string;
  number_of_orders: number;
  set_menus_count: number;
};

export type DB_SetMenu = {
  id: number;
  name: string;
  description: string | null;
  display_text: number;
  image: string | null;
  thumbnail: string | null;
  is_vegan: number;
  is_vegetarian: number;
  status: number;
  price_per_person: number;
  min_spend: number;
  is_seated: number;
  is_standing: number;
  is_canape: number;
  is_mixed_dietary: number;
  is_meal_prep: number;
  is_halal: number;
  is_kosher: number;
  price_includes: string | null;
  highlight: string | null;
  available: boolean;
  number_of_orders: number;
  created_at: string;
  updated_at: string;
  cuisines: DB_Cuisine[];
  group_dishes_count: number;
  group_selectable_dishes_count: number;
};

export type DB_MenuGroup = {
  id: number;
  set_menu_id: number;
  name: string | null;
  dishes_count: number;
  selectable_dishes_count: number;
};
