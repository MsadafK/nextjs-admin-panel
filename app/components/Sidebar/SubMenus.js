import React from 'react';
import { ChevronRight } from 'lucide-react';

const SubMenu = ({ items, setActiveItem, t, isDark, isDarkMode, position }) => {
  const dark = isDark || isDarkMode;

  return (
    <div className="py-1">
      {items.map((subItem) => {
        const SubIcon = subItem.icon;

        return (
          <div key={subItem.label} className="relative group/submenu">
            <button
              onClick={() => setActiveItem(subItem.label)}
              className={`w-full flex items-center px-3 py-2 text-sm transition-colors ${
                dark
                  ? 'text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
              }`}
            >
              <SubIcon size={15} className={`mr-3 ${dark ? 'text-zinc-500' : 'text-zinc-400'}`} />
              <span className="flex-1 text-left capitalize">
                {t ? t(subItem.label) : subItem.label}
              </span>
              {subItem.badge && (
                <span className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs px-1.5 py-0.5 rounded-full font-medium ml-2">
                  {subItem.badge}
                </span>
              )}
              {subItem.childItems && (
                <ChevronRight size={13} className={`ml-2 ${dark ? 'text-zinc-500' : 'text-zinc-400'}`} />
              )}
            </button>

            {/* Child Items (Third Level) */}
            {subItem.childItems && (
              <div
                className={`absolute ${
                  position === 'right' ? 'right-full mr-1' : 'left-full ml-1'
                } top-0 border rounded-lg shadow-dropdown min-w-[200px] py-1
                  opacity-0 invisible group-hover/submenu:opacity-100 group-hover/submenu:visible
                  transition-all duration-150 z-10 ${
                  dark
                    ? 'bg-zinc-900 border-zinc-800'
                    : 'bg-white border-zinc-200'
                }`}
              >
                <div className={`px-3 py-2 border-b mb-1 ${dark ? 'border-zinc-800' : 'border-zinc-200'}`}>
                  <span className={`text-xs font-semibold uppercase tracking-wide ${
                    dark ? 'text-zinc-500' : 'text-zinc-400'
                  }`}>
                    {t ? t(subItem.label) : subItem.label}
                  </span>
                </div>

                {subItem.childItems.map((childItem) => {
                  const ChildIcon = childItem.icon;
                  return (
                    <button
                      key={childItem.label}
                      onClick={() => setActiveItem(childItem.label)}
                      className={`w-full flex items-center px-3 py-2 text-sm transition-colors ${
                        dark
                          ? 'text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100'
                          : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                      }`}
                    >
                      <ChildIcon size={13} className={`mr-3 ${dark ? 'text-zinc-500' : 'text-zinc-400'}`} />
                      <span className="text-left capitalize">
                        {t ? t(childItem.label) : childItem.label}
                      </span>
                      {childItem.badge && (
                        <span className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs px-1.5 py-0.5 rounded-full font-medium ml-2">
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