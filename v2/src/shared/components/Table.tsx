import { useEffect, useState } from "react";
import CardBoxModal from "../../modules/_components/CardBox/Modal";
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import Buttons from "../../modules/_components/Buttons";
import { mdiEye, mdiTrashCan } from "@mdi/js";
import Button from "../../modules/_components/Button";
import type { PaginationResponse } from "../interface";
import type { UseMutationResult } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";

interface TableProps<TData> {
  data: PaginationResponse<TData>["data"];
  columns: ColumnDef<TData>[];
  onPageChange?: (pageIndex: number) => void;
  deleteMutation?: UseMutationResult<AxiosResponse<TData>, Error, string>;
}

const Table = <TData,>({ data, columns, onPageChange, deleteMutation }: TableProps<TData>) => {
  const [isModalTrashActive, setIsModalTrashActive] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string>('');

  const handleModalAction = () => {
    setIsModalTrashActive(false);
  };

  const pageIndex = Math.max(0, (data?.page ?? 1) - 1);
  const pageCount = data?.totalPages ?? 0;

  const dataTable = useReactTable({
    data: data?.items ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount,
    state: {
      pagination: {
        pageIndex,
        pageSize: data?.limit ?? 10,
      },
    },
  });

  useEffect(() => {
    if (deleteMutation?.isSuccess) {
      setIsModalTrashActive(false);
      setIdToDelete('');
    }
  }, [idToDelete]);

  return (
    <>
      <CardBoxModal
        title="Delete Role"
        buttonColor="danger"
        buttonLabel="Delete"
        isActive={isModalTrashActive}
        onConfirm={() => deleteMutation?.mutate(idToDelete)}
        onCancel={handleModalAction}
      >
        <p>
          Are you sure you want to delete this role?
        </p>
      </CardBoxModal>
      <table>
        <thead>
          {dataTable.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {dataTable.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="whitespace-nowrap before:hidden lg:w-1">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
              <td className="whitespace-nowrap before:hidden lg:w-1">
                <Buttons type="justify-start lg:justify-end" noWrap>
                  <Button
                    color="info"
                    icon={mdiEye}
                    onClick={() => setIsModalTrashActive(true)}
                    small
                    isGrouped
                  />
                  <Button
                    color="danger"
                    icon={mdiTrashCan}
                    onClick={() => {
                      setIsModalTrashActive(true);
                      setIdToDelete((row.original as any)._id);
                    }}
                    small
                    isGrouped
                  />
                </Buttons>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="border-t border-gray-100 p-3 lg:px-6 dark:border-slate-800">
        <div className="flex flex-col items-center justify-between gap-3 py-3 md:flex-row md:py-0">
          <small className="order-2 md:order-1 md:mt-0">
            Page {pageIndex + 1} of {pageCount || 1}
            {data?.total != null && ` (${data.total} total)`}
          </small>
          {pageCount > 1 && (
            <Buttons className="order-1 md:order-2">
              {Array.from({ length: pageCount }, (_, index) => (
                <Button
                  key={index}
                  active={index === pageIndex}
                  label={(index + 1).toString()}
                  color={index === pageIndex ? "lightDark" : "whiteDark"}
                  small
                  onClick={() => onPageChange?.(index)}
                  isGrouped
                />
              ))}
            </Buttons>
          )}
        </div>
      </div>
    </>
  );
};

export default Table;
