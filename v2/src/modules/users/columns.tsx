import type { ColumnDef } from "@tanstack/react-table";
import moment from "moment";

import type { UserResponse } from "./interface";

const columns = (): ColumnDef<UserResponse>[] => {
  return [
    {
      header: "Sr No.",
      cell: (info) => info.row.index + 1,
    },
    {
      header: "Name",
      accessorKey: "firstName",
      cell: (info) => {
        const { firstName, lastName } = info.row.original;
        return [firstName, lastName].filter(Boolean).join(" ") || "-";
      },
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Phone",
      accessorKey: "phone",
      cell: (info) => info.row.original.phone ?? "-",
    },
    {
      header: "Gender",
      accessorKey: "gender",
      cell: (info) =>
        info.row.original.gender
          ? String(info.row.original.gender).charAt(0).toUpperCase() +
            String(info.row.original.gender).slice(1)
          : "-",
    },
    {
      header: "Role",
      accessorKey: "role",
      cell: (info) => info.row.original.role?.name ?? "-",
    },
    {
      header: "DOB",
      accessorKey: "dob",
      cell: (info) =>
        info.row.original.dob
          ? moment(info.row.original.dob).format("DD/MM/YYYY")
          : "-",
    },
    {
      header: "Status",
      accessorKey: "isActive",
      cell: (info) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            info.row.original.isActive
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {info.row.original.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: "Verified",
      accessorKey: "isVerified",
      cell: (info) =>
        info.row.original.isVerified !== undefined ? (
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              info.row.original.isVerified
                ? "bg-green-100 text-green-800"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {info.row.original.isVerified ? "Yes" : "No"}
          </span>
        ) : (
          "-"
        ),
    },
    {
      header: "Created At",
      accessorKey: "createdAt",
      cell: (info) => moment(info.row.original.createdAt).format("DD/MM/YYYY"),
    },
    {
      header: "Updated At",
      accessorKey: "updatedAt",
      cell: (info) => moment(info.row.original.updatedAt).format("DD/MM/YYYY"),
    },
  ];
};

export default columns;