import { useEffect, useState } from "react";
import CardBoxModal from "../../modules/_components/CardBox/Modal";
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import Buttons from "../../modules/_components/Buttons";
import { mdiPencil, mdiTrashCan, mdiEye } from "@mdi/js";
import Button from "../../modules/_components/Button";
import type { PaginationResponse } from "../interface";
import type { UseMutationResult } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";

interface TableProps<TData> {
  data: PaginationResponse<TData>["data"];
  columns: ColumnDef<TData>[];
  onPageChange?: (pageIndex: number) => void;
  onView?: (row: TData) => void;
  onEdit?: (row: TData) => void;
  deleteMutation?: UseMutationResult<AxiosResponse<TData>, Error, string>;
  deleteModalTitle?: string;
  deleteModalMessage?: string;
}

const Table = <TData,>({ data, columns, onPageChange, onView, onEdit, deleteMutation, deleteModalTitle = "Delete", deleteModalMessage = "Are you sure you want to delete this item?" }: TableProps<TData>) => {
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
  }, [idToDelete, deleteMutation?.isSuccess]);

  return (
    <>
      {deleteMutation && (
        <CardBoxModal
          title={deleteModalTitle}
          buttonColor="danger"
          buttonLabel="Delete"
          isActive={isModalTrashActive}
          onConfirm={() => deleteMutation.mutate(idToDelete)}
          onCancel={handleModalAction}
        >
          <p>
            {deleteModalMessage}
          </p>
        </CardBoxModal>
      )}
      <table className="w-full table-fixed">
        <colgroup>
          {dataTable.getHeaderGroups()[0]?.headers.map((_, i) => (
            <col key={i} />
          ))}
          {(onView || onEdit || deleteMutation) && <col style={{ width: onView ? "8rem" : "6rem" }} />}
        </colgroup>
        <thead>
          {dataTable.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-2 py-2 text-left text-sm font-medium">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
              {(onView || onEdit || deleteMutation) && (
                <th className="px-2 py-2 text-right text-sm font-medium">
                  Actions
                </th>
              )}
            </tr>
          ))}
        </thead>
        <tbody>
          {dataTable.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="max-w-0 truncate px-2 py-2 before:hidden">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
              {(onView || onEdit || deleteMutation) && (
                <td className="whitespace-nowrap px-2 py-2">
                  <Buttons type="justify-end" noWrap>
                    {onView && (
                      <Button
                        color="info"
                        icon={mdiEye}
                        onClick={() => onView(row.original)}
                        small
                        isGrouped
                      />
                    )}
                    {onEdit && (
                      <Button
                        color="info"
                        icon={mdiPencil}
                        onClick={() => onEdit(row.original)}
                        small
                        isGrouped
                      />
                    )}
                    {deleteMutation && (
                      <Button
                        color="danger"
                        icon={mdiTrashCan}
                        onClick={() => {
                          setIsModalTrashActive(true);
                          setIdToDelete((row.original as { _id: string })._id);
                        }}
                        small
                        isGrouped
                      />
                    )}
                  </Buttons>
                </td>
              )}
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
