import { useEffect, useMemo, useState } from "react";
import { SetMenusResponse } from "../../types/api.types";
import { CuisineFilters } from "./components/CuisineFilters";
import { useFilterStore } from "./store";
import { MenuItem } from "./components/MenuItem";
import { GuestCounter } from "./components/GuestCounter";

const fetchMenus = async ({
  page = 1,
  perPage = 10,
  cuisineSlug,
}: {
  page?: number;
  perPage?: number;
  cuisineSlug?: string;
}) => {
  //localhost:3000/api/set-menus
  let url = `http://localhost:3000/api/set-menus?page=${page}&perPage=${perPage}`;
  if (cuisineSlug) {
    url += `&cuisineSlug=${cuisineSlug}`;
  }
  const response = await fetch(url);
  const menus = await response.json();
  return menus;
};

export const App = () => {
  const [menuRes, setMenuRes] = useState<SetMenusResponse | undefined>(
    undefined
  );

  const filter = useFilterStore((state) => state.filter);

  // load menus on page load
  useEffect(() => {
    // reset page
    setPage(1);
    fetchMenus({ page: 1, perPage: 9, cuisineSlug: filter?.slug }).then(
      (menus) => setMenuRes(menus)
    );
  }, [filter]);

  const [page, setPage] = useState(1);

  const handleLoadMore = () => {
    if (!menuRes?.meta.current_page) return;
    fetchMenus({
      page: page + 1,
      perPage: 9,
      cuisineSlug: filter?.slug,
    }).then((menus) => {
      setMenuRes({
        ...menus,
        setMenus: [...(menuRes?.setMenus || []), ...menus.setMenus],
      });
      setPage(page + 1);
    });
  };

  const showLoadMore = useMemo(() => {
    if (!menuRes) return false;
    return menuRes.meta.current_page < menuRes.meta.last_page;
  }, [menuRes]);

  return (
    // main container
    <div className="w-full mb-10">
      {/* inner body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* header */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold mt-6">Set Menus</h1>
        </div>
        {/* body */}
        <div className="flex flex-row mt-4 justify-between">
          <div className="flex flex-row items-center">
            <GuestCounter /> <span className="text-sm ml-2">Guests</span>
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg my-4">Filters:</h1>
          <CuisineFilters filters={menuRes?.filters} />
        </div>
        {/* menu items */}
        <div className="grid mt-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {menuRes?.setMenus.map((menu) => (
            <MenuItem key={menu.name} menu={menu} />
          ))}
        </div>
        {/* load more button */}
        <div className="flex flex-row justify-center">
          {showLoadMore && (
            <button
              className="bg-gray-800 text-white px-4 py-2 rounded-md"
              onClick={handleLoadMore}
            >
              Show More
            </button>
          )}
        </div>
        {/* footer */}
        <div className="flex flex-row justify-center">
          <p className="text-sm mt-4 text-gray-500">
            Showing {menuRes?.setMenus.length} of {menuRes?.meta.total} menus
          </p>
        </div>
        {menuRes?.meta.response_time_ms && (
          <div className="flex flex-row justify-center">
            <p className="text-sm mt-4 text-gray-900">
              Loaded in {menuRes?.meta.response_time_ms} ms
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
