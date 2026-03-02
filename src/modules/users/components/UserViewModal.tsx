import { Modal } from "../../../components/ui/modal";
import { User } from "../type";
import { X, Mail, Phone, User as UserIcon } from "lucide-react";
import moment from "moment";

interface UserViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
}

function UserViewModal({ isOpen, onClose, user }: UserViewModalProps) {
    if (!user) return null;

    const fullName = `${user.firstName} ${user.lastName}`;

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
                        <h2 className="text-xl font-semibold text-gray-900 pr-8">
                            {fullName}
                        </h2>
                        <div className="flex items-center gap-2 mt-2">
                            <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                    user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                }`}
                            >
                                {user.isActive ? "Active" : "Inactive"}
                            </span>
                            {user.role?.name && (
                                <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 capitalize">
                                    {user.role.name}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 flex items-center gap-1">
                                    <Mail className="h-3.5 w-3.5" />
                                    Email
                                </h3>
                                <a
                                    href={`mailto:${user.email}`}
                                    className="mt-1 text-gray-900 font-medium hover:text-brand-600"
                                >
                                    {user.email}
                                </a>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 flex items-center gap-1">
                                    <Phone className="h-3.5 w-3.5" />
                                    Phone
                                </h3>
                                <p className="mt-1 text-gray-900">{user.phone || "—"}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 flex items-center gap-1">
                                    <UserIcon className="h-3.5 w-3.5" />
                                    Gender
                                </h3>
                                <p className="mt-1 text-gray-900 capitalize">{user.gender || "—"}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Created At</h3>
                                <p className="mt-1 text-gray-900">
                                    {moment(user.createdAt).format("DD MMM YYYY, hh:mm A")}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Updated At</h3>
                                <p className="mt-1 text-gray-900">
                                    {moment(user.updatedAt).format("DD MMM YYYY, hh:mm A")}
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

export default UserViewModal;
