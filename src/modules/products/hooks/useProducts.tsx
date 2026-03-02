import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import moment from 'moment';

import { getProducts, deleteProduct } from '../api';
import { Product, ENUM_PRODUCT_STATUS } from '../type';
import { useModal } from '../../../hooks/useModal';

type FetchParams = {
    page?: number;
    search?: string;
    limit?: number;
}

function useProducts() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [params, setParams] = useState<FetchParams>({ page: 1, limit: 10, search: '' });
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    const [productToView, setProductToView] = useState<Product | null>(null);
    const { isOpen: isDeleteModalOpen, openModal: openDeleteModal, closeModal: closeDeleteModal } = useModal();
    const { isOpen: isViewModalOpen, openModal: openViewModal, closeModal: closeViewModal } = useModal();

    const { data, isLoading, isFetching, isRefetching, error } = useQuery({
        queryKey: ['products', params],
        queryFn: () => getProducts({ params: { page: params.page, limit: params.limit, search: params.search } }),
        select: (response) => response.data.data,
    });
console.log("data",data)
    const deleteMutation = useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            toast.success("Product deleted successfully!");
            queryClient.invalidateQueries({ queryKey: ['products'] });
            closeDeleteModal();
            setProductToDelete(null);
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error?.response?.data?.message || "Failed to delete product");
        }
    });

    const handleEdit = useCallback((product: Product) => {
        navigate(`/products/edit/${product._id}`);
    }, [navigate]);

    const handleViewClick = useCallback((product: Product) => {
        setProductToView(product);
        openViewModal();
    }, [openViewModal]);

    const handleCloseView = useCallback(() => {
        closeViewModal();
        setProductToView(null);
    }, [closeViewModal]);

    const handleDeleteClick = useCallback((product: Product) => {
        setProductToDelete(product);
        openDeleteModal();
    }, [openDeleteModal]);

    const handleConfirmDelete = useCallback(() => {
        if (productToDelete) {
            deleteMutation.mutate(productToDelete._id);
        }
    }, [productToDelete, deleteMutation]);

    const handleCancelDelete = useCallback(() => {
        closeDeleteModal();
        setProductToDelete(null);
    }, [closeDeleteModal]);

    const refetchData = useCallback((newParams: FetchParams) => {
        setParams(prev => ({
            ...prev,
            ...newParams,
        }));
    }, []);

    const getStatusBadge = (status: ENUM_PRODUCT_STATUS) => {
        const statusConfig = {
            [ENUM_PRODUCT_STATUS.DRAFT]: 'bg-yellow-100 text-yellow-800',
            [ENUM_PRODUCT_STATUS.SAVED]: 'bg-blue-100 text-blue-800',
            [ENUM_PRODUCT_STATUS.PUBLISH]: 'bg-green-100 text-green-800',
        };
        return statusConfig[status] || 'bg-gray-100 text-gray-800';
    };

    const columns: ColumnDef<Product>[] = useMemo(() => {
        const _columns: ColumnDef<Product>[] = [
            {
                header: 'Sr No.',
                cell: (info) => info.row.index + 1,
            },
            {
                header: 'Name',
                accessorKey: 'name',
                cell: (info) => (
                    <button
                        onClick={() => handleViewClick(info.row.original)}
                        className="font-medium text-brand-600 hover:text-brand-700 hover:underline text-left"
                    >
                        {info.row.original.name}
                    </button>
                ),
            },
            {
                header: 'Price',
                accessorKey: 'price',
                cell: (info) => (
                    <span className="text-gray-700">
                        ${info.row.original.price.toFixed(2)}
                    </span>
                ),
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: (info) => (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(info.row.original.status)}`}>
                        {info.row.original.status}
                    </span>
                ),
            },
            {
                header: 'Active',
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
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                        >
                            <Pencil className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => handleDeleteClick(info.row.original)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                ),
            },
        ];

        return _columns;
    }, [handleEdit, handleDeleteClick, handleViewClick]);

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
        // Delete modal props
        isDeleteModalOpen,
        productToDelete,
        handleConfirmDelete,
        handleCancelDelete,
        isDeleting: deleteMutation.isPending,
        // View modal props
        isViewModalOpen,
        productToView,
        handleCloseView,
    };
}

export default useProducts;
