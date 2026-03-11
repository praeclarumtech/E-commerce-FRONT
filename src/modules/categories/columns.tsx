import type { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { getImageUrl } from "../../shared/constant";
import type { Category } from "./interface";

export default function categoryColumns(): ColumnDef<Category>[] {
  return [
    {
      header: "Sr No.",
      cell: (info) => info.row.index + 1,
    },
    {
      header: "Image",
      accessorKey: "image",
      cell: (info) => {
        const image = info.row.original.image;
        const url = image ? getImageUrl(image) : "";
        return url ? (
          <img
            src={url}
            alt={info.row.original.name}
            className="h-10 w-10 rounded object-cover"
          />
        ) : (
          <span className="text-gray-400 dark:text-slate-500">—</span>
        );
      },
    },
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Status",
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
      header: "Subcategories",
      cell: (info) => info.row.original.subCategories?.length ?? 0,
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
