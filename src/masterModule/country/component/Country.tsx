import DataTable from "../../../shared/component/DataTable";
import DeleteCountryModel from "./DeleteCountryModel";
import useCountry from "../hooks/useCountry";

function Country() {
     const { 
        data, 
        columns, 
        isLoading, 
        refetchData, 
        pagination,
        deleteModalOpen,
        countryToDelete,
        isDeleting,
        handleDeleteConfirm,
        handleDeleteClose,
    } = useCountry();

    return (
        <div className="h-full">
            <DataTable 
                data={data} 
                columns={columns} 
                isLoading={isLoading} 
                title="Country"
                refetchData={refetchData} 
                pagination={pagination}
                addLink="/country/add"
            />
            <DeleteCountryModel
                isOpen={deleteModalOpen}
                onClose={handleDeleteClose}
                onConfirm={handleDeleteConfirm}
                isDeleting={isDeleting}
                countryName={countryToDelete?._id}
            />
        </div>
  )
}

export default Country