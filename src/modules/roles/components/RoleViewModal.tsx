import { Modal } from "../../../components/ui/modal";
import { Role } from "../type";
import { X } from "lucide-react";
import moment from "moment";

interface RoleViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    role: Role | null;
}

function RoleViewModal({ isOpen, onClose, role }: RoleViewModalProps) {
    if (!role) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl" showCloseButton={false}>
            <div className="relative flex flex-col max-h-[90vh]">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 z-20 p-2 rounded-full hover:bg-gray-100 transition-colors bg-white/90 shadow-sm border border-gray-200"
                    aria-label="Close"
                >
                    <X className="h-5 w-5 text-gray-500" />
                </button>

                <div className="overflow-y-auto flex-1 min-h-0">
                    <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                        <h2 className="text-xl font-semibold text-gray-900 pr-8 capitalize">
                            {role.name}
                        </h2>
                        <div className="flex items-center gap-2 mt-2">
                            <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                    role.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                }`}
                            >
                                {role.isActive ? "Active" : "Inactive"}
                            </span>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Created At</h3>
                                <p className="mt-1 text-gray-900">
                                    {moment(role.createdAt).format("DD MMM YYYY, hh:mm A")}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Updated At</h3>
                                <p className="mt-1 text-gray-900">
                                    {moment(role.updatedAt).format("DD MMM YYYY, hh:mm A")}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-3xl flex justify-end sticky bottom-0">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default RoleViewModal;
