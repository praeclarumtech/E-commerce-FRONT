import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useCallback, useState } from "react";
import { Eye } from "lucide-react";
import moment from "moment";

import { getOrders } from "../api";
import { Order } from "../type";
import { useModal } from "../../../hooks/useModal";

type FetchParams = {
    page?: number;
    search?: string;
    limit?: number;
};

function useOrders() {
    const [params, setParams] = useState<FetchParams>({ page: 1, limit: 10, search: "" });
    const [orderToView, setOrderToView] = useState<Order | null>(null);
    const { isOpen: isViewModalOpen, openModal: openViewModal, closeModal: closeViewModal } = useModal();

    const { data, isLoading, isFetching, isRefetching, error } = useQuery({
        queryKey: ["orders", params],
        queryFn: () => getOrders({ params: { page: params.page, limit: params.limit, search: params.search } }),
        select: (response) => response.data.data,
    });

    const handleViewClick = useCallback(
        (order: Order) => {
            setOrderToView(order);
            openViewModal();
        },
        [openViewModal]
    );

    const handleCloseView = useCallback(() => {
        closeViewModal();
        setOrderToView(null);
    }, [closeViewModal]);

    const refetchData = useCallback((newParams: FetchParams) => {
        setParams((prev) => ({ ...prev, ...newParams }));
    }, []);

    const columns: ColumnDef<Order>[] = useMemo(
        () => [
            {
                header: "Sr No.",
                cell: (info) => info.row.index + 1,
            },
            {
                header: "Order ID",
                accessorKey: "_id",
                cell: (info) => (
                    <button
                        onClick={() => handleViewClick(info.row.original)}
                        className="font-medium text-brand-600 hover:text-brand-700 hover:underline text-left"
                    >
                        {(info.row.original as Order).orderId as string ||
                            (info.row.original as Order)._id?.slice(-8) ||
                            "—"}
                    </button>
                ),
            },
            {
                header: "Status",
                accessorKey: "status",
                cell: (info) => {
                    const status = (info.row.original as Order).status as string | undefined;
                    return status ? (
                        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 capitalize">
                            {status}
                        </span>
                    ) : (
                        "—"
                    );
                },
            },
            {
                header: "Created At",
                accessorKey: "createdAt",
                cell: (info) =>
                    (info.row.original as Order).createdAt
                        ? moment((info.row.original as Order).createdAt as string).format("DD/MM/YYYY")
                        : "—",
            },
            {
                header: "Actions",
                id: "actions",
                cell: (info) => (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleViewClick(info.row.original as Order)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View"
                        >
                            <Eye className="h-4 w-4" />
                        </button>
                    </div>
                ),
            },
        ],
        [handleViewClick]
    );

    return {
        data: (data?.items as Order[]) || [],
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
        isViewModalOpen,
        orderToView,
        handleCloseView,
    };
}

export default useOrders;
