import { Modal } from "../../../components/ui/modal";
import { Offer } from "../type";
import { X } from "lucide-react";
import moment from "moment";

interface OfferViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    offer: Offer | null;
}

function OfferViewModal({ isOpen, onClose, offer }: OfferViewModalProps) {
    if (!offer) return null;

    const createdAt = offer.createdAt as string | undefined;
    const updatedAt = offer.updatedAt as string | undefined;
    const name = offer.name as string | undefined;

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
                            {name || "—"}
                        </h2>
                    </div>

                    <div className="p-6 space-y-6">
                        {offer.description && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                                <p className="mt-1 text-gray-700">{offer.description}</p>
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            {offer.code && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Code</h3>
                                    <p className="mt-1 text-gray-900 font-mono">{offer.code}</p>
                                </div>
                            )}
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Type</h3>
                                <p className="mt-1 text-gray-900 capitalize">{String(offer.type || "—").replace("_", " ")}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Value</h3>
                                <p className="mt-1 text-gray-900">{offer.value != null ? offer.value : "—"}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Target</h3>
                                <p className="mt-1 text-gray-900 capitalize">{String(offer.targetType || "—").replace("_", " ")}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                                <p className="mt-1">
                                    <span className={`px-2 py-1 rounded-full text-xs ${offer.isActive !== false ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                        {offer.isActive !== false ? "Active" : "Inactive"}
                                    </span>
                                </p>
                            </div>
                            {offer.startDate && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Start date</h3>
                                    <p className="mt-1 text-gray-900">{moment(offer.startDate).format("DD MMM YYYY, hh:mm A")}</p>
                                </div>
                            )}
                            {offer.endDate && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">End date</h3>
                                    <p className="mt-1 text-gray-900">{moment(offer.endDate).format("DD MMM YYYY, hh:mm A")}</p>
                                </div>
                            )}
                            {createdAt && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Created At</h3>
                                    <p className="mt-1 text-gray-900">
                                        {moment(createdAt).format("DD MMM YYYY, hh:mm A")}
                                    </p>
                                </div>
                            )}
                            {updatedAt && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Updated At</h3>
                                    <p className="mt-1 text-gray-900">
                                        {moment(updatedAt).format("DD MMM YYYY, hh:mm A")}
                                    </p>
                                </div>
                            )}
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

export default OfferViewModal;
