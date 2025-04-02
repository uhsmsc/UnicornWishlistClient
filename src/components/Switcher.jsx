import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext.jsx";
import lightIcon from "../assets/light.png";
import darkIcon from "../assets/dark.png";

const Switcher = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <label className="flex cursor-pointer select-none items-center">
      <div className="relative">
        <input type="checkbox" checked={theme === "dark"} onChange={toggleTheme} className="sr-only" />
        <div className="block h-8 w-14 rounded-full bg-white/30 dark:bg-indigo-300/40 transition"></div>
        <div
          className={`dot absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white dark:bg-gray-900 transition-all duration-300 ${
            theme === "dark" ? "translate-x-6" : ""
          }`}
        >
          <img
            src={theme === "dark" ? lightIcon : darkIcon}
            alt={theme === "dark" ? "Луна" : "Солнце"}
            className="w-4 h-4"
          />
        </div>
      </div>
    </label>
  );
};

export default Switcher;
