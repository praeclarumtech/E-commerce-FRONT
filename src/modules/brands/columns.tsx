import type { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import type { Brand } from "./interface";

export default function brandColumns(
  onNameClick?: (brand: Brand) => void
): ColumnDef<Brand>[] {
  return [
    {
      header: "Sr No.",
      cell: (info) => info.row.index + 1,
    },
    {
      header: "Name",
      accessorKey: "brandName",
      cell: (info) => {
        const brand = info.row.original;
        const name = brand.brandName ?? "—";
        if (onNameClick) {
          return (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNameClick(brand);
              }}
              className="cursor-pointer text-left text-blue-600 outline-none hover:underline focus:underline dark:text-blue-400"
            >
              {name}
            </button>
          );
        }
        return name;
      },
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
