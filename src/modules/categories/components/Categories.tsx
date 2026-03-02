import { useMemo } from 'react';
import DataTable from "../../../shared/component/DataTable";
import useCategories from "../hooks/useCategories";
import DeleteCategoryModal from "./DeleteCategoryModal";
import CategoryViewModal from "./CategoryViewModal";

function Categories() {
    const { 
        data, 
        columns, 
        isLoading, 
        refetchData, 
        pagination,
        isDeleteModalOpen,
        categoryToDelete,
        handleConfirmDelete,
        handleCancelDelete,
        isDeleting,
        isViewModalOpen,
        categoryToView,
        handleCloseView,
        expandedRows,
    } = useCategories();

    // Create expanded data with subcategories visible
    const expandedData = useMemo(() => {
        const result: any[] = [];
        data.forEach((category) => {
            result.push({ ...category, isSubCategory: false });
            if (expandedRows.has(category._id) && category.subCategories) {
                category.subCategories.forEach((sub) => {
                    result.push({ 
                        ...sub, 
                        isSubCategory: true, 
                        parentId: category._id,
                        parentName: category.name,
                    });
                });
            }
        });
        return result;
    }, [data, expandedRows]);

    return (
        <div className="h-full">
            <DataTable 
                data={expandedData} 
                columns={columns} 
                isLoading={isLoading} 
                title="Categories"
                refetchData={refetchData} 
                pagination={pagination}
                addLink="/categories/add"
            />
            
            <DeleteCategoryModal
                isOpen={isDeleteModalOpen}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                isLoading={isDeleting}
                categoryName={categoryToDelete?.name}
            />

            <CategoryViewModal
                isOpen={isViewModalOpen}
                onClose={handleCloseView}
                category={categoryToView}
            />
        </div>
    );
}

export default Categories;
