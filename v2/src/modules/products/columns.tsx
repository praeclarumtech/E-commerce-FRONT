import type { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import type { Product, ENUM_PRODUCT_STATUS } from "./interface";

function getStatusBadge(status: ENUM_PRODUCT_STATUS) {
  const statusConfig: Record<ENUM_PRODUCT_STATUS, string> = {
    [ENUM_PRODUCT_STATUS.DRAFT]: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    [ENUM_PRODUCT_STATUS.SAVED]: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    [ENUM_PRODUCT_STATUS.PUBLISH]: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  };
  return statusConfig[status] ?? "bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-slate-300";
}

export default function productColumns(): ColumnDef<Product>[] {
  return [
    { header: "Sr No.", cell: (info) => info.row.index + 1 },
    { header: "Name", accessorKey: "name" },
    {
      header: "Price",
      accessorKey: "price",
      cell: (info) => (
        <span className="text-gray-700 dark:text-slate-300">
          ${Number(info.row.original.price).toFixed(2)}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (info) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusBadge(
            info.row.original.status as ENUM_PRODUCT_STATUS
          )}`}
        >
          {info.row.original.status}
        </span>
      ),
    },
    {
      header: "Active",
      accessorKey: "isActive",
      cell: (info) => (
        <span
          className={`rounded-full px-2 py-1 text-xs ${
            info.row.original.isActive
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
          }`}
        >
          {info.row.original.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: "Created",
      accessorKey: "createdAt",
      cell: (info) =>
        info.row.original.createdAt
          ? moment(info.row.original.createdAt).format("DD/MM/YYYY")
          : "—",
    },
  ];
}
