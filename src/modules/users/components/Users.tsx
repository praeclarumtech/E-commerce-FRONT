import DataTable from "../../../shared/component/DataTable"
import useUsers from "../hooks/useUsers";

function Users() {

    const { data, columns, isLoading } = useUsers();

    return <DataTable data={data} columns={columns} isLoading={isLoading} />
}

export default Users