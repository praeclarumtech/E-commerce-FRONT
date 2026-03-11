import {
  mdiAccount,
  mdiLogout,
  mdiThemeLightDark,
} from "@mdi/js";
import type { MenuNavBarItem } from "../../_interfaces";

const menuNavBar: MenuNavBarItem[] = [
  {
    isCurrentUser: true,
    menu: [
      {
        icon: mdiAccount,
        label: "My Profile",
        href: "/profile",
      },
      {
        isDivider: true,
      },
      {
        icon: mdiLogout,
        label: "Log Out",
        isLogout: true,
      },
    ],
  },
  {
    icon: mdiThemeLightDark,
    label: "Light/Dark",
    isDesktopNoLabel: true,
    isToggleLightDark: true,
  },
];

export default menuNavBar;
