import { useQuery } from "@tanstack/react-query";
import { Modal } from "../../../components/ui/modal";
import { Product, Variant, ProductCategory, ProductUser } from "../type";
import { getVariantsByProduct } from "../variantApi";
import { getImageUrl as getImageUrlUtil } from "../../../shared/constant";
import { X, Package, ImageIcon, FolderTree, User } from "lucide-react";
import moment from "moment";

interface ProductViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
}

function ProductViewModal({ isOpen, onClose, product }: ProductViewModalProps) {
    // Fetch variants when modal opens
    const { data: variants = [], isLoading: isLoadingVariants } = useQuery({
        queryKey: ["variants", product?._id],
        queryFn: () => getVariantsByProduct(product!._id),
        select: (response) => response.data.data || [],
        enabled: isOpen && !!product?._id,
    });

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

    // Format variant attributes for display
    const formatAttributes = (attributes: Record<string, string | number>) => {
        return Object.entries(attributes)
            .map(([key, value]) => `${key}: ${value}`)
            .join(" | ");
    };

    // Get variant image
    const getVariantImage = (variant: Variant) => {
        if (!variant.images || variant.images.length === 0) return null;
        const primaryImage = variant.images.find((img) => img.isPrimary);
        return primaryImage?.imageUrl || variant.images[0]?.imageUrl;
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl" showCloseButton={false}>
            <div className="relative flex flex-col max-h-[90vh]">
                {/* Close Button - outside scroll area so it stays fixed */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 z-20 p-2 rounded-full hover:bg-gray-100 transition-colors bg-white/90 shadow-sm border border-gray-200"
                    aria-label="Close"
                >
                    <X className="h-5 w-5 text-gray-500" />
                </button>

                {/* Scrollable content */}
                <div className="overflow-y-auto flex-1 min-h-0">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
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
                            <h3 className="text-sm font-medium text-gray-500 flex items-center gap-1">
                                <FolderTree className="h-3.5 w-3.5" />
                                Category
                            </h3>
                            {typeof product.categoryId === 'object' ? (
                                <div className="mt-1">
                                    <p className="text-gray-900 font-medium">
                                        {(product.categoryId as ProductCategory)?.name || '-'}
                                    </p>
                                    {(product.categoryId as ProductCategory)?.subCategoryId && 
                                     (product.categoryId as ProductCategory)?.categoryId && (
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            ↳ Subcategory of{' '}
                                            <span className="font-medium text-gray-600">
                                                {(product.categoryId as ProductCategory).categoryId?.name}
                                            </span>
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <p className="mt-1 text-gray-900">{product.categoryId || '-'}</p>
                            )}
                        </div>
                        {/* Created By */}
                        {typeof product.userId === 'object' && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 flex items-center gap-1">
                                    <User className="h-3.5 w-3.5" />
                                    Created By
                                </h3>
                                <p className="mt-1 text-gray-900">
                                    {(product.userId as ProductUser)?.firstName}{' '}
                                    {(product.userId as ProductUser)?.lastName}
                                </p>
                            </div>
                        )}
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

                    {/* Variants Section */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Package className="h-4 w-4 text-brand-600" />
                            <h3 className="text-sm font-medium text-gray-500">
                                Variants ({isLoadingVariants ? '...' : variants.length})
                            </h3>
                        </div>

                        {isLoadingVariants ? (
                            <div className="flex items-center justify-center py-6">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-500"></div>
                            </div>
                        ) : variants.length === 0 ? (
                            <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                <p className="text-gray-400 text-sm">No variants available</p>
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {variants.map((variant: Variant) => {
                                    const variantImg = getVariantImage(variant);
                                    return (
                                        <div
                                            key={variant._id}
                                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100"
                                        >
                                            {/* Variant Image */}
                                            <div className="shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-white border border-gray-200">
                                                {variantImg ? (
                                                    <img
                                                        src={getImageUrlUtil(variantImg)}
                                                        alt="Variant"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <ImageIcon className="h-4 w-4" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Variant Info */}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 text-sm truncate">
                                                    {formatAttributes(variant.attributes)}
                                                </p>
                                                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                                    <span>
                                                        Price: <span className="font-medium text-gray-700">${variant.price || 0}</span>
                                                    </span>
                                                    <span>
                                                        Stock: <span className="font-medium text-gray-700">{variant.stock || 0}</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
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

export default ProductViewModal;
