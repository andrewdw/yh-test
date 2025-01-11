import { useGuestCountStore } from "../store";
import { Menu as MenuType } from "@/types/api.types";

export const MenuItem = ({ menu }: { menu: MenuType }) => {
  const label = menu.cuisines.map((cuisine) => cuisine.name).join(", ");
  const guestCount = useGuestCountStore((state) => state.guestCount);

  const priceByGuest = Math.round(menu.price * guestCount);
  const minSpend = menu.minSpend || 0;
  // price should never be less than minSpend
  const price = Math.max(priceByGuest, minSpend);

  return (
    <div className="flex flex-row">
      <div className="flex flex-col gap-y-2">
        <div className="flex flex-row">
          <div className="flex flex-col">
            <img
              src={menu.thumbnail}
              alt={menu.name}
              className="w-full h-full object-cover rounded-md aspect-square"
            />
          </div>
        </div>
        <div className="flex flex-row">
          <div className="flex flex-col text-sm text-gray-100 bg-gray-700 rounded-md px-2 py-1">
            {label}
          </div>
        </div>
        <div className="flex flex-row">
          <div className="flex flex-col text-lg font-bold">{menu.name}</div>
        </div>
        <div className="flex flex-row">
          <div className="flex flex-col text-sm text-gray-500">
            {menu.description}
          </div>
        </div>
        <div className="flex flex-row">
          <div className="flex flex-col text-md font-bold text-gray-500">
            ${price}
          </div>
        </div>
      </div>
    </div>
  );
};
