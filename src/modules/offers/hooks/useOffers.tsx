import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import moment from "moment";

import { getOffers, deleteOffer } from "../api";
import { Offer } from "../type";
import { useModal } from "../../../hooks/useModal";

type FetchParams = {
    page?: number;
    search?: string;
    limit?: number;
};

function useOffers() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [params, setParams] = useState<FetchParams>({ page: 1, limit: 10, search: "" });
    const [offerToDelete, setOfferToDelete] = useState<Offer | null>(null);
    const [offerToView, setOfferToView] = useState<Offer | null>(null);
    const { isOpen: isDeleteModalOpen, openModal: openDeleteModal, closeModal: closeDeleteModal } = useModal();
    const { isOpen: isViewModalOpen, openModal: openViewModal, closeModal: closeViewModal } = useModal();

    const { data, isLoading, isFetching, isRefetching, error } = useQuery({
        queryKey: ["offers", params],
        queryFn: () => getOffers({ params: { page: params.page, limit: params.limit, search: params.search } }),
        select: (response) => response.data.data,
    });

    const deleteMutation = useMutation({
        mutationFn: deleteOffer,
        onSuccess: () => {
            toast.success("Offer deleted successfully!");
            queryClient.invalidateQueries({ queryKey: ["offers"] });
            closeDeleteModal();
            setOfferToDelete(null);
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error?.response?.data?.message || "Failed to delete offer");
        },
    });

    const handleEdit = useCallback(
        (offer: Offer) => {
            navigate(`/offers/edit/${offer._id}`);
        },
        [navigate]
    );

    const handleViewClick = useCallback(
        (offer: Offer) => {
            setOfferToView(offer);
            openViewModal();
        },
        [openViewModal]
    );

    const handleCloseView = useCallback(() => {
        closeViewModal();
        setOfferToView(null);
    }, [closeViewModal]);

    const handleDeleteClick = useCallback(
        (offer: Offer) => {
            setOfferToDelete(offer);
            openDeleteModal();
        },
        [openDeleteModal]
    );

    const handleConfirmDelete = useCallback(() => {
        if (offerToDelete) {
            deleteMutation.mutate(offerToDelete._id);
        }
    }, [offerToDelete, deleteMutation]);

    const handleCancelDelete = useCallback(() => {
        closeDeleteModal();
        setOfferToDelete(null);
    }, [closeDeleteModal]);

    const refetchData = useCallback((newParams: FetchParams) => {
        setParams((prev) => ({ ...prev, ...newParams }));
    }, []);

    const columns: ColumnDef<Offer>[] = useMemo(
        () => [
            {
                header: "Sr No.",
                cell: (info) => info.row.index + 1,
            },
            {
                header: "Name",
                accessorKey: "name",
                cell: (info) => (
                    <button
                        onClick={() => handleViewClick(info.row.original)}
                        className="font-medium text-brand-600 hover:text-brand-700 hover:underline text-left"
                    >
                        {(info.row.original as Offer).name as string || "—"}
                    </button>
                ),
            },
            {
                header: "Created At",
                accessorKey: "createdAt",
                cell: (info) =>
                    (info.row.original as Offer).createdAt
                        ? moment((info.row.original as Offer).createdAt as string).format("DD/MM/YYYY")
                        : "—",
            },
            {
                header: "Actions",
                id: "actions",
                cell: (info) => (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleEdit(info.row.original as Offer)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                        >
                            <Pencil className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => handleDeleteClick(info.row.original as Offer)}
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
        data: (data?.items as Offer[]) || [],
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
        offerToDelete,
        handleConfirmDelete,
        handleCancelDelete,
        isDeleting: deleteMutation.isPending,
        isViewModalOpen,
        offerToView,
        handleCloseView,
    };
}

export default useOffers;
