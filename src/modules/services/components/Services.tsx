import DataTable from "../../../shared/component/DataTable";
import useServices from "../hooks/useServices";
import DeleteServiceModal from "./DeleteServiceModal";
import ServiceViewModal from "./ServiceViewModal";

function Services() {
    const {
        data,
        columns,
        isLoading,
        refetchData,
        pagination,
        isDeleteModalOpen,
        serviceToDelete,
        handleConfirmDelete,
        handleCancelDelete,
        isDeleting,
        isViewModalOpen,
        serviceToView,
        handleCloseView,
    } = useServices();

    return (
        <div className="h-full">
            <DataTable
                data={data}
                columns={columns}
                isLoading={isLoading}
                title="Services"
                refetchData={refetchData}
                pagination={pagination}
                addLink="/services/add"
            />
            <DeleteServiceModal
                isOpen={isDeleteModalOpen}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                isLoading={isDeleting}
                serviceName={(serviceToDelete as { name?: string })?.name}
            />
            <ServiceViewModal
                isOpen={isViewModalOpen}
                onClose={handleCloseView}
                service={serviceToView}
            />
        </div>
    );
}

export default Services;
