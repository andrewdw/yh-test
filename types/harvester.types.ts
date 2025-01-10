
export interface Cuisine {
  id: number;
  name: string;
}

export interface GroupDetails {
  ungrouped: number;
  [key: string]: number;
}

export interface Groups {
  dishes_count: number;
  selectable_dishes_count: number;
  groups: GroupDetails;
}

export interface SetMenu {
  created_at: string;
  cuisines: Cuisine[];
  description: string | null;
  display_text: number;
  image: string;
  thumbnail: string;
  is_vegan: number;
  is_vegetarian: number;
  name: string;
  status: number;
  groups: Groups;
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
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface Links {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface Meta {
  current_page: number;
  from: number;
  last_page: number;
  links: PaginationLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface SetMenusResponse {
  data: SetMenu[];
  links: Links;
  meta: Meta;
}