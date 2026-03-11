import type { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import type { Brand } from "./interface";

export default function brandColumns(): ColumnDef<Brand>[] {
  return [
    {
      header: "Sr No.",
      cell: (info) => info.row.index + 1,
    },
    {
      header: "Name",
      accessorKey: "brandName",
      cell: (info) => (info.row.original.brandName ?? "—"),
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
