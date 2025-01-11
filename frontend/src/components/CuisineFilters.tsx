import { useFilterStore } from "../store";
import cn from "../classNames";
import { Cuisine } from "@/types/api.types";
import { useMemo } from "react";

export const CuisineFilters = ({
  filters,
}: {
  filters?: {
    cuisines: Cuisine[];
  };
}) => {
  // return nothing if no cuisines
  if (!filters || filters.cuisines.length === 0) {
    return null;
  }

  const setFilter = useFilterStore((state) => state.setFilter);
  const filter = useFilterStore((state) => state.filter);
  const clearFilter = useFilterStore((state) => state.clearFilter);
  // onclick we set the cuisine filter
  const handleClick = (cuisine?: Cuisine) => {
    if (cuisine) {
      setFilter(cuisine);
    } else {
      clearFilter();
    }
  };

  // count all cuisines
  const allCuisinesCount = useMemo(
    () =>
      filters?.cuisines.reduce(
        (acc, cuisine) => acc + cuisine.set_menus_count,
        0
      ),
    [filters?.cuisines]
  );

  return (
    <div className="flex flex-row flex-wrap gap-2">
      {/* all filter */}
      <button
        className={cn(
          "border border-gray-300 rounded-md",
          "hover:bg-gray-100",
          "px-2 py-1",
          filter === undefined ? "bg-gray-800 text-white hover:bg-gray-700" : ""
        )}
        onClick={() => handleClick(undefined)}
      >
        All ({allCuisinesCount})
      </button>
      {filters.cuisines.map((cuisine) => (
        <button
          key={cuisine.slug}
          className={cn(
            "border border-gray-300 rounded-md",
            "hover:bg-gray-100",
            "px-2 py-1",
            filter?.slug === cuisine.slug
              ? "bg-gray-800 text-white hover:bg-gray-700"
              : ""
          )}
          onClick={() => handleClick(cuisine)}
        >
          {`${cuisine.name} (${cuisine.set_menus_count})`}
        </button>
      ))}
    </div>
  );
};
