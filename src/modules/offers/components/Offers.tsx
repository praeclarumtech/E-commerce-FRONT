import DataTable from "../../../shared/component/DataTable";
import useOffers from "../hooks/useOffers";
import DeleteOfferModal from "./DeleteOfferModal";
import OfferViewModal from "./OfferViewModal";

function Offers() {
    const {
        data,
        columns,
        isLoading,
        refetchData,
        pagination,
        isDeleteModalOpen,
        offerToDelete,
        handleConfirmDelete,
        handleCancelDelete,
        isDeleting,
        isViewModalOpen,
        offerToView,
        handleCloseView,
    } = useOffers();

    return (
        <div className="h-full">
            <DataTable
                data={data}
                columns={columns}
                isLoading={isLoading}
                title="Offers"
                refetchData={refetchData}
                pagination={pagination}
                addLink="/offers/add"
            />
            <DeleteOfferModal
                isOpen={isDeleteModalOpen}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                isLoading={isDeleting}
                offerName={(offerToDelete as { name?: string })?.name}
            />
            <OfferViewModal
                isOpen={isViewModalOpen}
                onClose={handleCloseView}
                offer={offerToView}
            />
        </div>
    );
}

export default Offers;
