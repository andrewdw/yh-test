export type SetMenusResponse = {
  filters: {
    cuisines: Cuisine[];
  };
  setMenus: Menu[];
};

export type Cuisine = {
  slug: string;
  number_of_orders: number;
  name: string;
  set_menus_count: number;
};

export type Menu = {
  name: string;
  description?: string;
  price: number;
  minSpend?: number;
  thumbnail: string;
  cuisines: Cuisine[];
};