export type SetMenusResponse = {
  filters: {
    cuisines: Cuisine[];
  };
  setMenus: Menu[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
    path: string;
    per_page: number;
    to: number;
    total: number;
    response_time_ms?: number;
  };
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