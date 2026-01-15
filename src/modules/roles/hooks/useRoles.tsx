import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Pencil, Trash2 } from 'lucide-react';
import { AxiosError } from 'axios';

import { getRoles, deleteRole } from '../api';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo, useCallback, useState } from 'react';
import moment from 'moment';
import { Role } from '../type';

type FetchParams = {
    page?: number;
    search?: string;
    limit?: number;
}

function useRoles() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [params, setParams] = useState<FetchParams>({ page: 1, limit: 10, search: '' });
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

    const { data, isLoading, isFetching, isRefetching, error } = useQuery({
        queryKey: ['roles', params],
        queryFn: () => getRoles({ params: { page: params.page, limit: params.limit, search: params.search } }),
        select: (response) => response.data.data,
    });

    const { isPending: isDeleting, mutate: deleteMutate } = useMutation({
        mutationFn: deleteRole,
        onSuccess: () => {
            toast.success("Role deleted successfully!");
            queryClient.invalidateQueries({ queryKey: ['roles'] });
            setDeleteModalOpen(false);
            setRoleToDelete(null);
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error?.response?.data?.message || "Failed to delete role");
        }
    });

    const refetchData = useCallback((newParams: FetchParams) => {
        setParams(prev => ({
            ...prev,
            ...newParams,
        }));
    }, []);

    const handleEdit = useCallback((role: Role) => {
        navigate(`/roles/edit/${role._id}`);
    }, [navigate]);

    const handleDeleteClick = useCallback((role: Role) => {
        setRoleToDelete(role);
        setDeleteModalOpen(true);
    }, []);

    const handleDeleteConfirm = useCallback(() => {
        if (roleToDelete) {
            deleteMutate(roleToDelete._id);
        }
    }, [roleToDelete, deleteMutate]);

    const handleDeleteClose = useCallback(() => {
        setDeleteModalOpen(false);
        setRoleToDelete(null);
    }, []);

    const columns: ColumnDef<Role>[] = useMemo(() => {
        const _columns: ColumnDef<Role>[] = [
            {
                header: 'Sr No.',
                cell: (info) => info.row.index + 1,
            },
            {
                header: 'Name',
                accessorKey: 'name',
                cell: (info) => (
                    <span className="font-medium text-gray-900 capitalize">
                        {info.row.original.name}
                    </span>
                ),
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
        roleToDelete,
        isDeleting,
        handleDeleteConfirm,
        handleDeleteClose,
    };
}

export default useRoles;
