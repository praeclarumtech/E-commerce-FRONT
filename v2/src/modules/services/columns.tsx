import type { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import type { Service } from "./interface";

export default function serviceColumns(onView?: (service: Service) => void): ColumnDef<Service>[] {
  return [
    {
      header: "Sr No.",
      cell: (info) => info.row.index + 1,
    },
    {
      header: "Title",
      accessorKey: "title",
      cell: (info) => {
        const title = (info.row.original.title as string) || "—";
        if (onView) {
          return (
            <button
              type="button"
              onClick={() => onView(info.row.original)}
              className="font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              {title}
            </button>
          );
        }
        return title;
      },
    },
    {
      header: "Key",
      accessorKey: "key",
      cell: (info) => (
        <span className="font-mono text-sm text-gray-600 dark:text-slate-400">
          {(info.row.original.key as string) || "—"}
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
          ? moment(info.row.original.createdAt as string).format("DD/MM/YYYY")
          : "—",
    },
  ];
}
