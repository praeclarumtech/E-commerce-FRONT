import DataTable from "../../../shared/component/DataTable";
import useRoles from "../hooks/useRoles";
import DeleteRoleModal from "./DeleteRoleModal";

function Roles() {
    const { 
        data, 
        columns, 
        isLoading, 
        refetchData, 
        pagination,
        deleteModalOpen,
        roleToDelete,
        isDeleting,
        handleDeleteConfirm,
        handleDeleteClose,
    } = useRoles();

    return (
        <div className="h-full">
            <DataTable 
                data={data} 
                columns={columns} 
                isLoading={isLoading} 
                title="Roles"
                refetchData={refetchData} 
                pagination={pagination}
                addLink="/roles/add"
            />
            <DeleteRoleModal
                isOpen={deleteModalOpen}
                onClose={handleDeleteClose}
                onConfirm={handleDeleteConfirm}
                isDeleting={isDeleting}
                roleName={roleToDelete?.name}
            />
        </div>
    );
}

export default Roles;
