import DataTable from "../../../shared/component/DataTable"
import useUsers from "../hooks/useUsers";
import DeleteUserModal from "./DeleteUserModal";

function Users() {
    const { 
        data, 
        columns, 
        isLoading, 
        refetchData, 
        pagination,
        deleteModalOpen,
        userToDelete,
        isDeleting,
        handleDeleteConfirm,
        handleDeleteClose,
    } = useUsers();

    return (
        <div className="h-full">
            <DataTable 
                data={data} 
                columns={columns} 
                isLoading={isLoading} 
                title="Users"
                refetchData={refetchData} 
                pagination={pagination}
                addLink="/users/add"
            />
            <DeleteUserModal
                isOpen={deleteModalOpen}
                onClose={handleDeleteClose}
                onConfirm={handleDeleteConfirm}
                isDeleting={isDeleting}
                userName={userToDelete ? `${userToDelete.firstName} ${userToDelete.lastName}` : undefined}
            />
        </div>
    )
}

export default Users