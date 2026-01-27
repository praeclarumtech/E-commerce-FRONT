import { Modal } from "../../../components/ui/modal";
import { Product } from "../type";
import { X } from "lucide-react";
import moment from "moment";

interface ProductViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
}

function ProductViewModal({ isOpen, onClose, product }: ProductViewModalProps) {
    if (!product) return null;

    // Handle images - they might be objects or strings
    const getImageUrl = (img: unknown): string => {
        if (typeof img === 'object' && img !== null) {
            const imgObj = img as { imageUrl?: string; url?: string };
            return imgObj.imageUrl || imgObj.url || '';
        }
        return typeof img === 'string' ? img : '';
    };

    const images = product.images?.map(getImageUrl).filter(Boolean) || [];

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl">
            <div className="relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
                >
                    <X className="h-5 w-5 text-gray-500" />
                </button>

                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900 pr-8">
                        {product.name}
                    </h2>
                    <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.status === 'Draft' ? 'bg-yellow-100 text-yellow-800' :
                            product.status === 'Saved' ? 'bg-blue-100 text-blue-800' :
                            product.status === 'Publish' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>
                            {product.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                            product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                            {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Images */}
                    {images.length > 0 && (
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-3">Images</h3>
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {images.map((url, index) => (
                                    <img
                                        key={index}
                                        src={url}
                                        alt={`${product.name} - ${index + 1}`}
                                        className="h-24 w-24 rounded-lg object-cover border border-gray-200 shrink-0"
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Price</h3>
                            <p className="mt-1 text-lg font-semibold text-gray-900">
                                ${product.price.toFixed(2)}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Category</h3>
                            <p className="mt-1 text-gray-900">
                                {typeof product.categoryId === 'object' 
                                    ? (product.categoryId as { name?: string })?.name || '-'
                                    : product.categoryId || '-'
                                }
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Created At</h3>
                            <p className="mt-1 text-gray-900">
                                {moment(product.createdAt).format('DD MMM YYYY, hh:mm A')}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Updated At</h3>
                            <p className="mt-1 text-gray-900">
                                {moment(product.updatedAt).format('DD MMM YYYY, hh:mm A')}
                            </p>
                        </div>
                    </div>

                    {/* Description */}
                    {product.description && (
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                            <p className="text-gray-700 leading-relaxed">
                                {product.description}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default ProductViewModal;
