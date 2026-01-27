import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import moment from 'moment';

import { getCategories, deleteCategory } from '../api';
import { Category } from '../type';
import { useModal } from '../../../hooks/useModal';
import { getImageUrl } from '../../../shared/constant';

type FetchParams = {
    page?: number;
    search?: string;
    limit?: number;
}

function useCategories() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [params, setParams] = useState<FetchParams>({ page: 1, limit: 10, search: '' });
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
    const [categoryToView, setCategoryToView] = useState<Category | null>(null);
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const { isOpen: isDeleteModalOpen, openModal: openDeleteModal, closeModal: closeDeleteModal } = useModal();
    const { isOpen: isViewModalOpen, openModal: openViewModal, closeModal: closeViewModal } = useModal();

    const { data, isLoading, isFetching, isRefetching, error } = useQuery({
        queryKey: ['categories', params],
        queryFn: () => getCategories({ params: { page: params.page, limit: params.limit, search: params.search } }),
        select: (response) => response.data.data,
    });

    const deleteMutation = useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            toast.success("Category deleted successfully!");
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            closeDeleteModal();
            setCategoryToDelete(null);
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error?.response?.data?.message || "Failed to delete category");
        }
    });

    const handleEdit = useCallback((category: Category) => {
        navigate(`/categories/edit/${category._id}`);
    }, [navigate]);

    const handleViewClick = useCallback((category: Category) => {
        setCategoryToView(category);
        openViewModal();
    }, [openViewModal]);

    const handleCloseView = useCallback(() => {
        closeViewModal();
        setCategoryToView(null);
    }, [closeViewModal]);

    const handleDeleteClick = useCallback((category: Category) => {
        setCategoryToDelete(category);
        openDeleteModal();
    }, [openDeleteModal]);

    const handleConfirmDelete = useCallback(() => {
        if (categoryToDelete) {
            deleteMutation.mutate(categoryToDelete._id);
        }
    }, [categoryToDelete, deleteMutation]);

    const handleCancelDelete = useCallback(() => {
        closeDeleteModal();
        setCategoryToDelete(null);
    }, [closeDeleteModal]);

    const toggleRowExpand = useCallback((categoryId: string) => {
        setExpandedRows(prev => {
            const newSet = new Set(prev);
            if (newSet.has(categoryId)) {
                newSet.delete(categoryId);
            } else {
                newSet.add(categoryId);
            }
            return newSet;
        });
    }, []);

    const refetchData = useCallback((newParams: FetchParams) => {
        setParams(prev => ({
            ...prev,
            ...newParams,
        }));
    }, []);

    const columns: ColumnDef<Category>[] = useMemo(() => {
        const _columns: ColumnDef<Category>[] = [
            {
                header: '',
                id: 'expand',
                cell: (info) => {
                    const hasSubCategories = info.row.original.subCategories && info.row.original.subCategories.length > 0;
                    const isExpanded = expandedRows.has(info.row.original._id);
                    
                    if (!hasSubCategories) {
                        return <div className="w-6" />;
                    }
                    
                    return (
                        <button
                            onClick={() => toggleRowExpand(info.row.original._id)}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                            {isExpanded ? (
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                            ) : (
                                <ChevronRight className="h-4 w-4 text-gray-500" />
                            )}
                        </button>
                    );
                },
            },
            {
                header: 'Image',
                id: 'image',
                cell: (info) => {
                    const imageUrl = getImageUrl(info.row.original.image);
                    return (
                        <div className="h-10 w-10 rounded-lg overflow-hidden bg-gray-100">
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt={info.row.original.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">
                                    No img
                                </div>
                            )}
                        </div>
                    );
                },
            },
            {
                header: 'Name',
                accessorKey: 'name',
                cell: (info) => (
                    <div>
                        <button
                            onClick={() => handleViewClick(info.row.original)}
                            className="font-medium text-brand-600 hover:text-brand-700 hover:underline text-left"
                        >
                            {info.row.original.name}
                        </button>
                        {info.row.original.subCategories && info.row.original.subCategories.length > 0 && (
                            <span className="ml-2 text-xs text-gray-500">
                                ({info.row.original.subCategories.length} subcategories)
                            </span>
                        )}
                    </div>
                ),
            },
            {
                header: 'Description',
                accessorKey: 'description',
                cell: (info) => (
                    <span className="text-gray-600 text-sm truncate max-w-[200px] block">
                        {info.row.original.description || '-'}
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
                header: 'Actions',
                id: 'actions',
                cell: (info) => {
                    // Hide actions for subcategories
                    const isSubCategory = (info.row.original as Category & { isSubCategory?: boolean }).isSubCategory;
                    if (isSubCategory) {
                        return <div className="w-16" />;
                    }
                    
                    return (
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
                    );
                },
            },
        ];

        return _columns;
    }, [handleEdit, handleDeleteClick, handleViewClick, expandedRows, toggleRowExpand]);

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
        categoryToDelete,
        handleConfirmDelete,
        handleCancelDelete,
        isDeleting: deleteMutation.isPending,
        // View modal props
        isViewModalOpen,
        categoryToView,
        handleCloseView,
        // Expand functionality
        expandedRows,
        toggleRowExpand,
    };
}

export default useCategories;
