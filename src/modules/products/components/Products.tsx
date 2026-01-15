import DataTable from "../../../shared/component/DataTable";
import useProducts from "../hooks/useProducts";
import DeleteConfirmModal from "./DeleteConfirmModal";
import ProductViewModal from "./ProductViewModal";

function Products() {
  const {
    data,
    columns,
    isLoading,
    refetchData,
    pagination,
    isDeleteModalOpen,
    productToDelete,
    handleConfirmDelete,
    handleCancelDelete,
    isDeleting,
    isViewModalOpen,
    productToView,
    handleCloseView,
  } = useProducts();

  return (
    <div className="h-full">
      <DataTable
        data={data}
        columns={columns}
        isLoading={isLoading}
        title="Products"
        refetchData={refetchData}
        pagination={pagination}
        addLink="/products/add"
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        productName={productToDelete?.name}
      />

      <ProductViewModal
        isOpen={isViewModalOpen}
        onClose={handleCloseView}
        product={productToView}
      />
    </div>
  );
}

export default Products;
