import DataTable from "../../../shared/component/DataTable";
import useBrands from "../hooks/useBrands";
import DeleteBrandModal from "./DeleteBrandModal";
import BrandViewModal from "./BrandViewModal";

function Brands() {
    const {
        data,
        columns,
        isLoading,
        refetchData,
        pagination,
        isDeleteModalOpen,
        brandToDelete,
        handleConfirmDelete,
        handleCancelDelete,
        isDeleting,
        isViewModalOpen,
        brandToView,
        handleCloseView,
    } = useBrands();

    return (
        <div className="h-full">
            <DataTable
                data={data}
                columns={columns}
                isLoading={isLoading}
                title="Brands"
                refetchData={refetchData}
                pagination={pagination}
                addLink="/brands/add"
            />
            <DeleteBrandModal
                isOpen={isDeleteModalOpen}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                isLoading={isDeleting}
                brandName={brandToDelete?.brandName}
            />
            <BrandViewModal
                isOpen={isViewModalOpen}
                onClose={handleCloseView}
                brand={brandToView}
            />
        </div>
    );
}

export default Brands;
