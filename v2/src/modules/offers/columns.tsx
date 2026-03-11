import type { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import type { Offer } from "./interface";

export default function offerColumns(onView?: (offer: Offer) => void): ColumnDef<Offer>[] {
  return [
    {
      header: "Sr No.",
      cell: (info) => info.row.index + 1,
    },
    {
      header: "Name",
      accessorKey: "name",
      cell: (info) => {
        const name = (info.row.original.name as string) || "—";
        if (onView) {
          return (
            <button
              type="button"
              onClick={() => onView(info.row.original)}
              className="font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              {name}
            </button>
          );
        }
        return name;
      },
    },
    {
      header: "Type",
      accessorKey: "type",
      cell: (info) => (info.row.original.type as string) || "—",
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
          ? moment(info.row.original.createdAt as string).format("DD/MM/YYYY")
          : "—",
    },
  ];
}
