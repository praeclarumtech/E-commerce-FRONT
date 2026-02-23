import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import moment from "moment";

import { getBrands, deleteBrand } from "../api";
import { Brand } from "../type";
import { useModal } from "../../../hooks/useModal";

type FetchParams = {
    page?: number;
    search?: string;
    limit?: number;
};

function useBrands() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [params, setParams] = useState<FetchParams>({ page: 1, limit: 10, search: "" });
    const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);
    const [brandToView, setBrandToView] = useState<Brand | null>(null);
    const { isOpen: isDeleteModalOpen, openModal: openDeleteModal, closeModal: closeDeleteModal } = useModal();
    const { isOpen: isViewModalOpen, openModal: openViewModal, closeModal: closeViewModal } = useModal();

    const { data, isLoading, isFetching, isRefetching, error } = useQuery({
        queryKey: ["brands", params],
        queryFn: () => getBrands({ params: { page: params.page, limit: params.limit, search: params.search } }),
        select: (response) => response.data.data,
    });

    const deleteMutation = useMutation({
        mutationFn: deleteBrand,
        onSuccess: () => {
            toast.success("Brand deleted successfully!");
            queryClient.invalidateQueries({ queryKey: ["brands"] });
            closeDeleteModal();
            setBrandToDelete(null);
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error?.response?.data?.message || "Failed to delete brand");
        },
    });

    const handleEdit = useCallback(
        (brand: Brand) => {
            navigate(`/brands/edit/${brand._id}`);
        },
        [navigate]
    );

    const handleViewClick = useCallback(
        (brand: Brand) => {
            setBrandToView(brand);
            openViewModal();
        },
        [openViewModal]
    );

    const handleCloseView = useCallback(() => {
        closeViewModal();
        setBrandToView(null);
    }, [closeViewModal]);

    const handleDeleteClick = useCallback(
        (brand: Brand) => {
            setBrandToDelete(brand);
            openDeleteModal();
        },
        [openDeleteModal]
    );

    const handleConfirmDelete = useCallback(() => {
        if (brandToDelete) {
            deleteMutation.mutate(brandToDelete._id);
        }
    }, [brandToDelete, deleteMutation]);

    const handleCancelDelete = useCallback(() => {
        closeDeleteModal();
        setBrandToDelete(null);
    }, [closeDeleteModal]);

    const refetchData = useCallback((newParams: FetchParams) => {
        setParams((prev) => ({ ...prev, ...newParams }));
    }, []);

    const columns: ColumnDef<Brand>[] = useMemo(
        () => [
            {
                header: "Sr No.",
                cell: (info) => info.row.index + 1,
            },
            {
                header: "Name",
                accessorKey: "brandName",
                cell: (info) => (
                    <button
                        onClick={() => handleViewClick(info.row.original)}
                        className="font-medium text-brand-600 hover:text-brand-700 hover:underline text-left"
                    >
                        {(info.row.original as Brand).brandName || "—"}
                    </button>
                ),
            },
            {
                header: "Created At",
                accessorKey: "createdAt",
                cell: (info) =>
                    (info.row.original as Brand).createdAt
                        ? moment((info.row.original as Brand).createdAt as string).format("DD/MM/YYYY")
                        : "—",
            },
            {
                header: "Actions",
                id: "actions",
                cell: (info) => (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleEdit(info.row.original as Brand)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                        >
                            <Pencil className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => handleDeleteClick(info.row.original as Brand)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                ),
            },
        ],
        [handleEdit, handleDeleteClick, handleViewClick]
    );

    return {
        data: (data?.items as Brand[]) || [],
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
        isDeleteModalOpen,
        brandToDelete,
        handleConfirmDelete,
        handleCancelDelete,
        isDeleting: deleteMutation.isPending,
        isViewModalOpen,
        brandToView,
        handleCloseView,
    };
}

export default useBrands;
