import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";

import {
  LayoutDashboard, Users, ChevronDown, Lock,
  Package,
  FolderTree,
  Shield
} from "lucide-react";
import { useSidebar } from "../context/SidebarContext";
import { useUser } from "../context/UserDataContext";
import { removeCookie } from "../shared/utils/auth";
import { ECOMMERCE_ACCESS_TOKEN } from "../shared/constant";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
  roles?: string[]; // Roles that can see this menu item
};

const allNavItems: NavItem[] = [
  {
    icon: <LayoutDashboard />,
    name: "Dashboard",
    path: "/",
  },
  {
    icon: <Shield />,
    name: "Roles",
    path: "/roles",
  },
  {
    icon: <Users />,
    name: "Users",
    path: "/users",
  },
  {
    icon: <FolderTree />,
    name: "Categories",
    path: "/categories",
  },
  {
    icon: <Package />,
    name: "Products",
    path: "/products",
  }
];

function AppSidebar() {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const { user } = useUser();

  // Filter menu items based on user role
  const navItems = allNavItems.filter((item) => {
    // If no roles specified, item is visible to all
    if (!item.roles || item.roles.length === 0) {
      return true;
    }
    // If user role is in the allowed roles, show the item
    return user?.role && item.roles.includes(user.role);
  });


  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    navItems.forEach((nav, index) => {
      if (nav.subItems) {
        nav.subItems.forEach((subItem) => {
          if (isActive(subItem.path)) {
            setOpenSubmenu({
              type: "main",
              index,
            });
            submenuMatched = true;
          }
        });
      }
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const handleLogout = useCallback(() => {
    removeCookie(ECOMMERCE_ACCESS_TOKEN);
    window.location.href = '/e-comm/signin';
  }, []);

  const renderMenuItems = (items: NavItem[], menuType: "main") => (
    <ul className="flex flex-col gap-1">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={clsx(
                "menu-item group cursor-pointer",
                {
                  "menu-item-active": openSubmenu?.type === menuType && openSubmenu?.index === index,
                  "menu-item-inactive": !(openSubmenu?.type === menuType && openSubmenu?.index === index),
                  "lg:justify-center": !isExpanded && !isHovered,
                  "lg:justify-start": isExpanded || isHovered
                }
              )}
            >
              <span
                className={clsx(
                  "menu-item-icon-size",
                  {
                    "menu-item-icon-active": openSubmenu?.type === menuType && openSubmenu?.index === index,
                    "menu-item-icon-inactive": !(openSubmenu?.type === menuType && openSubmenu?.index === index)
                  }
                )}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDown
                  className={clsx(
                    "ml-auto w-5 h-5 transition-transform duration-200",
                    {
                      "rotate-180 text-cyan-600": openSubmenu?.type === menuType && openSubmenu?.index === index,
                      "text-gray-500 group-hover:text-cyan-600": !(openSubmenu?.type === menuType && openSubmenu?.index === index)
                    }
                  )}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={clsx(
                  "menu-item group",
                  {
                    "menu-item-active": isActive(nav.path),
                    "menu-item-inactive": !isActive(nav.path)
                  }
                )}
              >
                <span
                  className={clsx(
                    "menu-item-icon-size",
                    {
                      "menu-item-icon-active": isActive(nav.path),
                      "menu-item-icon-inactive": !isActive(nav.path)
                    }
                  )}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300 ease-in-out"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-1 space-y-0.5 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={clsx(
                        "menu-dropdown-item",
                        {
                          "menu-dropdown-item-active": isActive(subItem.path),
                          "menu-dropdown-item-inactive": !isActive(subItem.path)
                        }
                      )}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={clsx(
                              "ml-auto menu-dropdown-badge",
                              {
                                "menu-dropdown-badge-active": isActive(subItem.path),
                                "menu-dropdown-badge-inactive": !isActive(subItem.path)
                              }
                            )}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={clsx(
                              "ml-auto menu-dropdown-badge",
                              {
                                "menu-dropdown-badge-active": isActive(subItem.path),
                                "menu-dropdown-badge-inactive": !isActive(subItem.path)
                              }
                            )}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <aside
        className={clsx(
          "fixed mt-16 flex flex-col lg:mt-0 top-0 px-4 left-0 bg-white text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 shadow-sm",
          {
            "w-[290px]": isExpanded || isMobileOpen || isHovered,
            "w-[90px]": !isExpanded && !isMobileOpen && !isHovered,
            "translate-x-0": isMobileOpen,
            "-translate-x-full": !isMobileOpen
          },
          "lg:translate-x-0"
        )}
        onMouseEnter={() => !isExpanded && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={clsx(
            "py-6 flex border-b border-gray-100",
            {
              "lg:justify-center": !isExpanded && !isHovered,
              "justify-start": isExpanded || isHovered
            }
          )}
        >
          {(isExpanded || isHovered || isMobileOpen) ? (
            <>Logo</>
          ) : (
            <>Logo</>
          )}
        </div>
        <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar flex-1">
          <nav className="py-4 h-full">
            <div className="flex flex-col gap-2 h-full">
              <div>
                {renderMenuItems(navItems, "main")}
              </div>
              <div className="mt-auto border-t border-gray-200 pt-4 pb-4">
                <button
                  onClick={handleLogout}
                  className={clsx(
                    "flex menu-item group menu-item-inactive",
                    {
                      "lg:justify-center": !isExpanded && !isHovered,
                      "lg:justify-start": isExpanded || isHovered
                    }
                  )}
                >
                  <span className="menu-item-icon-size menu-item-icon-inactive">
                    <Lock />
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="menu-item-text">Logout</span>
                  )}
                </button>
              </div>
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
}

export default AppSidebar;
