import DataTable from "../../../shared/component/DataTable";
import useCity from "../hooks/useCity";
import DeleteCityModel from "./DeleteCityModel";

function City() {
    const {
        data,
        columns,
        isLoading,
        refetchData,
        pagination,
        deleteModalOpen,
        cityToDelete,
        isDeleting,
        handleDeleteConfirm,
        handleDeleteClose,
    } = useCity();

    return (
        <div className="h-full">
            <DataTable
                data={data}
                columns={columns}
                isLoading={isLoading}
                title="City"
                refetchData={refetchData}
                pagination={pagination}
                addLink="/city/add"
            />
            <DeleteCityModel
                isOpen={deleteModalOpen}
                onClose={handleDeleteClose}
                onConfirm={handleDeleteConfirm}
                isDeleting={isDeleting}
                cityName={cityToDelete?._id}
            />
        </div>
    )
}

export default City