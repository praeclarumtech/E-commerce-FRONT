import DataTable from "../../../shared/component/DataTable"
import useUsers from "../hooks/useUsers";

function Users() {

    const { data, columns, isLoading, refetchData, pagination } = useUsers();

    return (
        <div className="h-full">
            <DataTable 
                data={data} 
                columns={columns} 
                isLoading={isLoading} 
                refetchData={refetchData} 
                pagination={pagination}
                addLink="/users/add"
            />
        </div>
    )
}

export default Users