import {
  mdiAccountGroup,
  mdiMonitor,
  mdiShieldKey,
  mdiFolderOutline,
  mdiTagOutline,
  mdiPackageVariant,
  mdiPercentBoxOutline,
  mdiCartOutline,
  mdiArchive,
  mdiCogOutline,
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
    href: "/categories",
    label: "Categories",
    icon: mdiFolderOutline,
  },
  {
    href: "/brands",
    label: "Brands",
    icon: mdiTagOutline,
  },
  {
    href: "/products",
    label: "Products",
    icon: mdiPackageVariant,
  },
  {
    href: "/offers",
    label: "Offers",
    icon: mdiPercentBoxOutline,
  },
  {
    href: "/orders",
    label: "Orders",
    icon: mdiCartOutline,
  },
  {
    href: "/inventory",
    label: "Inventory",
    icon: mdiArchive,
  },
  {
    href: "/services",
    label: "Services",
    icon: mdiCogOutline,
  },
];

export default menuAside;
