import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { mdiChevronUp, mdiChevronDown } from "@mdi/js";
import Divider from "../../../../_components/Divider";
import Icon from "../../../../_components/Icon";
import UserAvatarCurrentUser from "../../UserAvatar/CurrentUser";
import NavBarMenuList from "../MenuList";
import type { MenuNavBarItem } from "../../../../_interfaces";
import { useDarkModeStore } from "../../../../_stores/darkModeSlice";
import { useMainStore } from "../../../../_stores/mainSlice";

type Props = {
  item: MenuNavBarItem;
  onRouteChange: () => void;
};

export default function NavBarItem({ item, ...props }: Props) {
  const userName = useMainStore((s) => s.userName);
  const setDarkMode = useDarkModeStore((s) => s.setDarkMode);

  const [isDropdownActive, setIsDropdownActive] = useState(false);

  const componentClass = [
    "block lg:flex items-center relative cursor-pointer",
    isDropdownActive
      ? `navbar-item-label-active dark:text-slate-400`
      : `navbar-item-label dark:text-white dark:hover:text-slate-400`,
    item.menu ? "lg:py-2 lg:px-3" : "py-2 px-3",
    item.isDesktopNoLabel ? "lg:w-16 lg:justify-center" : "",
  ].join(" ");

  const itemLabel = item.isCurrentUser ? userName : item.label;

  const handleMenuClick = () => {
    if (item.menu) {
      setIsDropdownActive(!isDropdownActive);
    }

    if (item.isToggleLightDark) {
      setDarkMode(null);
    }
  };

  const NavBarItemComponentContents = (
    <>
      <div
        className={`flex items-center ${
          item.menu
            ? "bg-gray-100 p-3 lg:bg-transparent lg:p-0 dark:bg-slate-800 lg:dark:bg-transparent"
            : ""
        }`}
        onClick={handleMenuClick}
      >
        {item.isCurrentUser && <UserAvatarCurrentUser className="mr-3 inline-flex h-6 w-6" />}
        {item.icon && <Icon path={item.icon} className="transition-colors" />}
        <span
          className={`px-2 transition-colors ${
            item.isDesktopNoLabel && item.icon ? "lg:hidden" : ""
          }`}
        >
          {itemLabel}
        </span>
        {item.menu && (
          <Icon
            path={isDropdownActive ? mdiChevronUp : mdiChevronDown}
            className="hidden transition-colors lg:inline-flex"
          />
        )}
      </div>
      {item.menu && (
        <div
          className={`${
            !isDropdownActive ? "lg:hidden" : ""
          } border-b border-gray-100 text-sm lg:absolute lg:top-full lg:left-0 lg:z-20 lg:min-w-full lg:rounded-lg lg:border lg:bg-white lg:shadow-lg dark:border-slate-700 lg:dark:bg-slate-800`}
        >
          <NavBarMenuList menu={item.menu} onRouteChange={props.onRouteChange} />
        </div>
      )}
    </>
  );

  if (item.isDivider) {
    return <Divider navBar />;
  }

  if (item.href) {
    const isExternal = item.href.startsWith("http");
    if (isExternal) {
      return (
        <a
          href={item.href}
          target={item.target}
          rel="noreferrer"
          className={componentClass}
          onClick={props.onRouteChange}
        >
          {NavBarItemComponentContents}
        </a>
      );
    }
    return (
      <Link
        to={item.href}
        target={item.target}
        className={componentClass}
        onClick={props.onRouteChange}
      >
        {NavBarItemComponentContents}
      </Link>
    );
  }

  return <div className={componentClass}>{NavBarItemComponentContents}</div>;
}
