import DataTable from "../../../shared/component/DataTable";
import useOrders from "../hooks/useOrders";
import OrderViewModal from "./OrderViewModal";

function Orders() {
    const {
        data,
        columns,
        isLoading,
        refetchData,
        pagination,
        isViewModalOpen,
        orderToView,
        handleCloseView,
    } = useOrders();

    return (
        <div className="h-full">
            <DataTable
                data={data}
                columns={columns}
                isLoading={isLoading}
                title="Orders"
                refetchData={refetchData}
                pagination={pagination}
            />
            <OrderViewModal
                isOpen={isViewModalOpen}
                onClose={handleCloseView}
                order={orderToView}
            />
        </div>
    );
}

export default Orders;
