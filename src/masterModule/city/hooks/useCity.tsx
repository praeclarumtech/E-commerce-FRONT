import { useCallback, useMemo, useState } from "react";

import moment from "moment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ColumnDef } from "@tanstack/react-table";
import { AxiosError } from "axios";

import { deleteCity, getCity } from "../api";
import { City } from "../type";

type FetchParams = {
    page?: number;
    search?: string;
    limit?: number;
}

function useCity() {

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [params, setParams] = useState<FetchParams>({ page: 1, limit: 10, search: '' });
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [cityToDelete, setCityToDelete] = useState<City | null>(null);

    const { data, isLoading, isFetching, isRefetching, error } = useQuery({
        queryKey: ['city', params],
        queryFn: () => getCity({ params: { page: params.page, limit: params.limit, search: params.search } }),
        select: (response) => response.data.data,
    });

    const { isPending: isDeleting, mutate: deleteMutate } = useMutation({
        mutationFn: deleteCity,
        onSuccess: () => {
            toast.success("City deleted successfully!");
            queryClient.invalidateQueries({ queryKey: ['city'] });
            setDeleteModalOpen(false);
            setCityToDelete(null);
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error?.response?.data?.message || "Failed to delete city");
        }
    });

    const refetchData = useCallback((newParams: FetchParams) => {
        setParams(prev => ({
            ...prev,
            ...newParams,
        }));
    }, []);

    const handleEdit = useCallback((cityName: City) => {
        navigate(`/city/edit/${cityName._id}`);
    }, [navigate]);

    const handleDeleteClick = useCallback((cityName: City) => {
        setCityToDelete(cityName);
        setDeleteModalOpen(true);
    }, []);

    const handleDeleteConfirm = useCallback(() => {
        if (cityToDelete) {
            deleteMutate(cityToDelete._id);
        }
    }, [cityToDelete, deleteMutate]);

    const handleDeleteClose = useCallback(() => {
        setDeleteModalOpen(false);
        setCityToDelete(null);
    }, []);

    const columns: ColumnDef<City>[] = useMemo(() => {
        const _columns: ColumnDef<City>[] = [
            {
                header: 'Sr No.',
                cell: (info) => info.row.index + 1,
            },
            {
                header: 'Name',
                accessorKey: 'cityName',
            },
            {
                header: 'Status',
                accessorKey: 'isActive',
                cell: (info) => (
                    <span className={`px-2 py-1 rounded-full text-xs ${info.row.original.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`
                    }>
                        {info.row.original.isActive ? 'Active' : 'Inactive'}
                    </span>
                ),
            },
            {
                header: 'Created At',
                accessorKey: 'createdAt',
                cell: (info) => moment(info.row.original.createdAt).format('DD/MM/YYYY'),
            },
            {
                header: 'Updated At',
                accessorKey: 'updatedAt',
                cell: (info) => moment(info.row.original.updatedAt).format('DD/MM/YYYY'),
            },
            {
                header: 'Actions',
                id: 'actions',
                cell: (info) => (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleEdit(info.row.original)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                        >
                            <Pencil className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => handleDeleteClick(info.row.original)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                ),
            },
        ];

        return _columns;
    }, [handleEdit, handleDeleteClick]);

    return {
        data: data?.items || [],
        isLoading: isLoading || isFetching || isRefetching,
        error,
        columns,
        refetchData,
        pagination: {
            currentPage: data?.page || 1,
            totalPages: data?.totalPages || 1,
            totalItems: data?.total || 0,
            limit: params.limit || 10,
        },
        // Delete modal state
        deleteModalOpen,
        cityToDelete,
        isDeleting,
        handleDeleteConfirm,
        handleDeleteClose,
    }
}

export default useCity