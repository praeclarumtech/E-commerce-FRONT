import { Modal } from "../../../components/ui/modal";

interface DeleteCountryModelProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isDeleting: boolean;
    countryName?: string;
}

function DeleteCountryModel({ 
    isOpen, 
    onClose,
    onConfirm, 
    isDeleting, 
    countryName 
}: DeleteCountryModelProps) {

    return (
        <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
        className="max-w-md"
        showCloseButton={false}
        >
            <div className="p-6">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-100">
                    <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-center text-gray-900">
                    Delete Country
                </h3>
                 <p className="text-sm text-gray-500 mb-6">
                    Are you sure you want to delete{' '}
                    {countryName && (
                        <span className="font-medium text-gray-700">"{countryName}"</span>
                    )}
                    ? This action cannot be undone.
                </p>
                <div className="flex items-center justify-center gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="px-4 py-2 text-sm font-medium text-gray-700 transition rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="px-4 py-2 text-sm font-medium text-white transition rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </Modal>
    )
}

export default DeleteCountryModel