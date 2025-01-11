import cn from "../classNames";
import { useGuestCountStore } from "../store";
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa6";

export const GuestCounter = () => {
  const guestCount = useGuestCountStore((state) => state.guestCount);
  const setGuestCount = useGuestCountStore((state) => state.setGuestCount);

  const handleGuestCount = (count: number) => {
    // don't allow below 1 guest count
    if (guestCount + count < 1) return;
    setGuestCount(guestCount + count);
  };
  return (
    <span className="isolate inline-flex rounded-md shadow-sm font-semibold">
      <button
        type="button"
        onClick={() => handleGuestCount(-1)}
        className={cn(
          "relative inline-flex items-center rounded-l-full px-3 bg-slate-200 py-2 text-sm text-gray-900 ring-1 ring-inset ring-gray-300",
          "hover:bg-slate-300 focus:z-10",
          "disabled:bg-slate-100 disabled:text-slate-300 disabled:cursor-not-allowed"
        )}
        disabled={guestCount <= 1}
      >
        <FaMinus />
      </button>
      <span className="relative px-5 -ml-px inline-flex items-center bg-slate-200 py-2 text-sm text-gray-900 ring-1 ring-inset ring-gray-300">
        {guestCount}
      </span>
      <button
        type="button"
        className={cn(
          "relative -ml-px inline-flex items-center rounded-r-full px-3 bg-slate-200 py-2 text-sm text-gray-900 ring-1 ring-inset ring-gray-300",
          "hover:bg-slate-300 focus:z-10"
        )}
        onClick={() => handleGuestCount(1)}
      >
        <FaPlus />
      </button>
    </span>
  );
};
