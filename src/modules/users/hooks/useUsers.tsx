import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Pencil, Trash2 } from 'lucide-react';
import { AxiosError } from 'axios';

import { getUsers, deleteUser } from '../api';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo, useCallback, useState } from 'react';
import moment from 'moment';
import { User } from '../type';

type FetchParams = {
    page?: number;
    search?: string;
    limit?: number;
}

function useUsers() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [params, setParams] = useState<FetchParams>({ page: 1, limit: 10, search: '' });
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    const { data, isLoading, isFetching, isRefetching, error } = useQuery({
        queryKey: ['users', params],
        queryFn: () => getUsers({ params: { page: params.page, limit: params.limit, search: params.search } }),
        select: (response) => response.data.data,
    });

    const { isPending: isDeleting, mutate: deleteMutate } = useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            toast.success("User deleted successfully!");
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setDeleteModalOpen(false);
            setUserToDelete(null);
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error?.response?.data?.message || "Failed to delete user");
        }
    });

    const refetchData = useCallback((newParams: FetchParams) => {
        setParams(prev => ({
            ...prev,
            ...newParams,
        }));
    }, []);

    const handleEdit = useCallback((user: User) => {
        navigate(`/users/edit/${user._id}`);
    }, [navigate]);

    const handleDeleteClick = useCallback((user: User) => {
        setUserToDelete(user);
        setDeleteModalOpen(true);
    }, []);

    const handleDeleteConfirm = useCallback(() => {
        if (userToDelete) {
            deleteMutate(userToDelete._id);
        }
    }, [userToDelete, deleteMutate]);

    const handleDeleteClose = useCallback(() => {
        setDeleteModalOpen(false);
        setUserToDelete(null);
    }, []);

    const columns: ColumnDef<User>[] = useMemo(() => {
        const _columns: ColumnDef<User>[] = [
            {
                header: 'Sr No.',
                cell: (info) => info.row.index + 1,
            },
            {
                header: 'Name',
                accessorKey: 'firstName',
                cell: (info) => `${info.row.original.firstName} ${info.row.original.lastName}`,
            },
            {
                header: 'Email',
                accessorKey: 'email',
                cell: (info) => (
                    <a href={`mailto:${info.row.original.email}`} className="text-[#465fff] hover:underline">
                        {info.row.original.email}
                    </a>
                ),
            },
            {
                header: 'Phone',
                accessorKey: 'phone',
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
        userToDelete,
        isDeleting,
        handleDeleteConfirm,
        handleDeleteClose,
    };
}

export default useUsers