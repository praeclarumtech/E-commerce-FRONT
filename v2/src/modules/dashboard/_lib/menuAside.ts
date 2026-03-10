import {
  mdiAccountCircle,
  mdiMonitor,
  mdiAlertCircle,
  mdiSquareEditOutline,
  mdiTable,
  mdiViewList,
  mdiTelevisionGuide,
  mdiShieldKey,
  mdiAccountGroup,
} from "@mdi/js";
import type { MenuAsideItem } from "../../_interfaces";

const menuAside: MenuAsideItem[] = [
  {
    href: "/",
    icon: mdiMonitor,
    label: "Dashboard",
  },
  {
    href: "/roles",
    label: "Roles",
    icon: mdiShieldKey,
  },
  {
    href: "/users",
    label: "Users",
    icon: mdiAccountGroup,
  },
  {
    href: "/dashboard/tables",
    label: "Tables",
    icon: mdiTable,
  },
  {
    href: "/dashboard/forms",
    label: "Forms",
    icon: mdiSquareEditOutline,
  },
  {
    href: "/dashboard/ui",
    label: "UI",
    icon: mdiTelevisionGuide,
  },
  {
    href: "/profile",
    label: "Profile",
    icon: mdiAccountCircle,
  },
  {
    href: "/error",
    label: "Error",
    icon: mdiAlertCircle,
  },
  {
    label: "Dropdown",
    icon: mdiViewList,
    menu: [
      {
        label: "Item One",
      },
      {
        label: "Item Two",
      },
    ],
  },
];

export default menuAside;
