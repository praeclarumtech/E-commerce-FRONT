import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable, VisibilityState } from '@tanstack/react-table';
import { ChevronDown, Columns3, Download, Plus, Search } from 'lucide-react';
import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { debounce } from '../utils/debounce';
import ReactPaginate from 'react-paginate';

type RefetchParams = {
    page?: number;
    search?: string;
    limit?: number;
}

type PaginationData = {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    limit: number;
}

type DataTableProps<T> = {
    data: T[];
    columns: ColumnDef<T>[];
    isLoading: boolean;
    addLink?: string;
    onExport?: () => void;
    refetchData?: (params: RefetchParams) => void;
    pagination?: PaginationData;
}

const LIMIT_OPTIONS = [10, 25, 50, 100];

function DataTable<T>({
    data,
    columns,
    isLoading,
    addLink,
    onExport,
    refetchData,
    pagination,
}: DataTableProps<T>) {
    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState('');
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [isColumnDropdownOpen, setIsColumnDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleAddClick = useCallback(() => {
        if (addLink) {
            navigate(addLink);
        }
    }, [addLink, navigate]);

    // Debounced search function
    const debouncedSearch = useMemo(
        () => debounce((value: string) => {
            refetchData?.({ search: value, page: 1 });
        }, 300),
        [refetchData]
    );

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);
        debouncedSearch(value);
    }, [debouncedSearch]);

    // Handle page change
    const handlePageChange = useCallback((selectedItem: { selected: number }) => {
        refetchData?.({ page: selectedItem.selected + 1 });
    }, [refetchData]);

    // Handle limit change
    const handleLimitChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLimit = Number(e.target.value);
        refetchData?.({ limit: newLimit, page: 1 });
    }, [refetchData]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsColumnDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const table = useReactTable({
        data,
        columns,
        state: {
            columnVisibility,
        },
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    return (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm h-full flex flex-col">
            {/* Header Section */}
            <div className="relative border-b border-gray-100 bg-gradient-to-r from-gray-50/80 to-white p-5 rounded-t-xl flex-shrink-0">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    {/* Left Side - Search Input */}
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchValue}
                            onChange={handleSearchChange}
                            placeholder="Search..."
                            className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-700 placeholder:text-gray-400 transition-all duration-200 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 sm:w-64"
                        />
                    </div>

                    {/* Right Side - Action Buttons */}
                    <div className="flex items-center gap-2">
                        {/* Column Visibility Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                type="button"
                                onClick={() => setIsColumnDropdownOpen(!isColumnDropdownOpen)}
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-600 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                            >
                                <Columns3 className="h-4 w-4" />
                                <span className="hidden sm:inline">Columns</span>
                                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isColumnDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {isColumnDropdownOpen && (
                                <div className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-lg border border-gray-200 bg-white shadow-lg ring-1 ring-black/5">
                                    <div className="p-2">
                                        <div className="mb-2 px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Toggle Columns
                                        </div>
                                        <div className="max-h-64 overflow-y-auto">
                                            {table.getAllLeafColumns().map((column) => (
                                                <label
                                                    key={column.id}
                                                    className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 hover:bg-gray-50 transition-colors"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={column.getIsVisible()}
                                                        onChange={column.getToggleVisibilityHandler()}
                                                        className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500/20 focus:ring-2 focus:ring-offset-0"
                                                    />
                                                    <span className="text-sm text-gray-700 capitalize">
                                                        {typeof column.columnDef.header === 'string'
                                                            ? column.columnDef.header
                                                            : column.id.replace(/_/g, ' ')}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Export Button */}
                        <button
                            type="button"
                            onClick={onExport}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-600 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                        >
                            <Download className="h-4 w-4" />
                            <span className="hidden sm:inline">Export</span>
                        </button>

                        {/* Add Button */}
                        {addLink && (
                            <button
                                type="button"
                                onClick={handleAddClick}
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-brand-600 hover:shadow-md active:bg-brand-700"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Add New</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
            {!isLoading ? (
                <div className="flex-1 max-w-full overflow-x-auto overflow-y-auto">
                    <div className="relative min-h-full bg-neutral-primary-soft shadow-xs rounded-base border border-default">
                        <table className="w-full text-sm text-left rtl:text-right text-body">
                            <thead className="text-sm text-body bg-neutral-secondary-soft border-b rounded-base border-default sticky top-0">
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
                <div className="flex-1 flex items-center justify-center p-10">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#465fff]"></div>
                </div>
            )}

            {/* Pagination Section */}
            {pagination && pagination.totalPages > 0 && (
                <div className="border-t border-gray-100 bg-gray-50/50 px-5 py-4 rounded-b-xl flex-shrink-0">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        {/* Left side - Items info & Limit selector */}
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600">
                                Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to {Math.min(pagination.currentPage * pagination.limit, pagination.totalItems)} of {pagination.totalItems} entries
                            </span>
                            <div className="flex items-center gap-2">
                                <label htmlFor="limit-select" className="text-sm text-gray-600">
                                    Show:
                                </label>
                                <select
                                    id="limit-select"
                                    value={pagination.limit}
                                    onChange={handleLimitChange}
                                    className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                                >
                                    {LIMIT_OPTIONS.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Right side - Pagination */}
                        <ReactPaginate
                            pageCount={pagination.totalPages}
                            pageRangeDisplayed={3}
                            marginPagesDisplayed={1}
                            onPageChange={handlePageChange}
                            forcePage={pagination.currentPage - 1}
                            containerClassName="flex items-center gap-1"
                            pageClassName="inline-flex"
                            pageLinkClassName="inline-flex h-9 min-w-[36px] items-center justify-center rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50"
                            activeClassName="[&>a]:bg-brand-500 [&>a]:border-brand-500 [&>a]:text-white [&>a]:hover:bg-brand-600"
                            previousClassName="inline-flex"
                            previousLinkClassName="inline-flex h-9 items-center justify-center rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            nextClassName="inline-flex"
                            nextLinkClassName="inline-flex h-9 items-center justify-center rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            breakClassName="inline-flex"
                            breakLinkClassName="inline-flex h-9 min-w-[36px] items-center justify-center text-sm text-gray-500"
                            disabledClassName="opacity-50 cursor-not-allowed"
                            previousLabel="Previous"
                            nextLabel="Next"
                        />
                    </div>
                </div>
            )}
        </div >
    )
}

export default DataTable