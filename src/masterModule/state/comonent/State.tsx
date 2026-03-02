import DeleteStateModel from './DeleteStateModel';
import DataTable from '../../../shared/component/DataTable';
import useStates from '../hooks/useStates';

function State() {
  const { 
        data, 
        columns, 
        isLoading, 
        refetchData, 
        pagination,
        deleteModalOpen,
        stateToDelete,
        isDeleting,
        handleDeleteConfirm,
        handleDeleteClose,
    } = useStates();

    return (
        <div className="h-full">
            <DataTable 
                data={data} 
                columns={columns} 
                isLoading={isLoading} 
                title="State"
                refetchData={refetchData} 
                pagination={pagination}
                addLink="/state/add"
            />
            <DeleteStateModel
                isOpen={deleteModalOpen}
                onClose={handleDeleteClose}
                onConfirm={handleDeleteConfirm}
                isDeleting={isDeleting}
                stateName={stateToDelete?._id}
            />
        </div>
  )
}

export default State