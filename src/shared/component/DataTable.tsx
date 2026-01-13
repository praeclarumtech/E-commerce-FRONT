import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import Input from '../../components/form/input/InputField';
import { Import, ImportIcon, Plus } from 'lucide-react';
import Button from '../../components/ui/button/Button';

type DataTableProps<T> = {
    data: T[];
    columns: ColumnDef<T>[];
    isLoading: boolean;
}

function DataTable<T>({ data, columns, isLoading }: DataTableProps<T>) {

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="flex items-center gap-2 p-4">
                <Input />
                <Button size='sm' variant='outline' className='ml-auto'><ImportIcon /></Button>
                <Button startIcon={<Plus />} size='sm'>Add</Button>
            </div>
            {!isLoading ? (
                <div className="max-w-full overflow-x-auto">
                    <div className="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default">
                        <table className="w-full text-sm text-left rtl:text-right text-body">
                            <thead className="text-sm text-body bg-neutral-secondary-soft border-b rounded-base border-default">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <th key={header.id} colSpan={header.colSpan} className="px-6 py-3 font-medium">
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext(),
                                                    )}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody>
                                {table.getRowModel().rows.map((row) => (
                                    <tr key={row.id} className="bg-neutral-primary border-b border-default">
                                        {row.getVisibleCells().map((cell) => (
                                            <td className="px-6 py-4" key={cell.id} >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center min-h-full p-10">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#465fff]"></div>
                </div>
            )}
        </div >
    )
}

export default DataTable