// SubMenu.jsx
import React from "react";
import { ChevronRight } from "lucide-react";

const SubMenu = ({ items, setActiveItem, t, isDark, isDarkMode, position }) => {
  return (
    <div className="py-1">
      {items.map((subItem) => {
        const SubIcon = subItem.icon;

        return (
          <div key={subItem.label} className="relative group/submenu">
            <button
              onClick={() => setActiveItem(subItem.label)}
              className={`w-full flex items-center px-3 py-2 text-sm ${
                isDark || isDarkMode
                  ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              } transition-colors`}
            >
              <SubIcon size={16} className="mr-3 text-gray-400" />
              <span className="flex-1 text-left">
                {t ? t(subItem.label) : subItem.label}
              </span>
              {subItem.badge && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-2">
                  {subItem.badge}
                </span>
              )}
              {subItem.childItems && (
                <ChevronRight size={14} className="ml-2 text-gray-400" />
              )}
            </button>

            {/* Child Items (Third Level) */}
            {subItem.childItems && (
              <div
                className={`absolute ${
                  position === "right" ? "right-full mr-1" : "left-full ml-1"
                } top-0 ${
                  isDark || isDarkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                } border rounded-lg shadow-xl min-w-[200px] py-2 opacity-0 invisible group-hover/submenu:opacity-100 group-hover/submenu:visible transition-all duration-200 z-10`}
              >
                <div
                  className={`px-3 py-2 border-b ${
                    isDark || isDarkMode ? "border-gray-700" : "border-gray-200"
                  } mb-1`}
                >
                  <span
                    className={`text-xs font-medium ${
                      isDark || isDarkMode ? "text-gray-400" : "text-gray-500"
                    } uppercase tracking-wide`}
                  >
                    {t ? t(subItem.label) : subItem.label}
                  </span>
                </div>

                {subItem.childItems.map((childItem) => {
                  const ChildIcon = childItem.icon;
                  return (
                    <button
                      key={childItem.label}
                      onClick={() => setActiveItem(childItem.label)}
                      className={`w-full flex items-center px-3 py-2 text-sm ${
                        isDark || isDarkMode
                          ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      } transition-colors`}
                    >
                      <ChildIcon size={14} className="mr-3 text-gray-400" />
                      <span className="text-left">
                        {t ? t(childItem.label) : childItem.label}
                      </span>
                      {childItem.badge && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-2">
                          {childItem.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SubMenu;
