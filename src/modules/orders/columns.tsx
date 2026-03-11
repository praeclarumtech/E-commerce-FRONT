import type { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import type { Order } from "./interface";

export default function orderColumns(onView: (order: Order) => void): ColumnDef<Order>[] {
  return [
    {
      header: "Sr No.",
      cell: (info) => info.row.index + 1,
    },
    {
      header: "Order ID",
      accessorKey: "_id",
      cell: (info) => {
        const order = info.row.original;
        const displayId = (order.orderId as string) || order._id?.slice(-8) || "—";
        return (
          <button
            type="button"
            onClick={() => onView(order)}
            className="font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            {displayId}
          </button>
        );
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (info) => {
        const status = info.row.original.status as string | undefined;
        return status ? (
          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800 capitalize dark:bg-blue-900/30 dark:text-blue-400">
            {status}
          </span>
        ) : (
          "—"
        );
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
