import { Modal } from "../../../components/ui/modal";
import { Category, CategoryUser } from "../type";
import { X, User } from "lucide-react";
import moment from "moment";
import { getImageUrl } from "../../../shared/constant";

interface CategoryViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    category: Category | null;
}

function CategoryViewModal({ isOpen, onClose, category }: CategoryViewModalProps) {
    if (!category) return null;

    const imageUrl = getImageUrl(category.image);

    // Get creator name from userId
    const getCreatorName = (): string | null => {
        if (!category.userId) return null;
        if (typeof category.userId === 'object') {
            const user = category.userId as CategoryUser;
            return `${user.firstName} ${user.lastName}`;
        }
        return null;
    };

    const creatorName = getCreatorName();

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
                    <div className="flex items-start gap-4">
                        {/* Category Image */}
                        <div className="h-16 w-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt={category.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">
                                    No image
                                </div>
                            )}
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                {category.name}
                            </h2>
                            <div className="flex items-center gap-2 mt-2">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                    category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                    {category.isActive ? 'Active' : 'Inactive'}
                                </span>
                                {category.subCategories && category.subCategories.length > 0 && (
                                    <span className="text-sm text-gray-500">
                                        {category.subCategories.length} subcategories
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Description */}
                    {category.description && (
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                            <p className="text-gray-700 leading-relaxed">
                                {category.description}
                            </p>
                        </div>
                    )}

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {creatorName && (
                            <div className="col-span-2">
                                <h3 className="text-sm font-medium text-gray-500">Created By</h3>
                                <div className="mt-1 flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center">
                                        <User className="h-4 w-4 text-brand-600" />
                                    </div>
                                    <span className="text-gray-900 font-medium">{creatorName}</span>
                                </div>
                            </div>
                        )}
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Created At</h3>
                            <p className="mt-1 text-gray-900">
                                {moment(category.createdAt).format('DD MMM YYYY, hh:mm A')}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Updated At</h3>
                            <p className="mt-1 text-gray-900">
                                {moment(category.updatedAt).format('DD MMM YYYY, hh:mm A')}
                            </p>
                        </div>
                    </div>

                    {/* Subcategories */}
                    {category.subCategories && category.subCategories.length > 0 && (
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-3">Subcategories</h3>
                            <div className="space-y-2">
                                {category.subCategories.map((sub) => {
                                    const subImageUrl = getImageUrl(sub.image);
                                    return (
                                        <div
                                            key={sub._id}
                                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                                        >
                                            <div className="h-10 w-10 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                                                {subImageUrl ? (
                                                    <img
                                                        src={subImageUrl}
                                                        alt={sub.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center text-gray-400 text-[10px]">
                                                        No img
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 truncate">
                                                    {sub.name}
                                                </p>
                                                {sub.description && (
                                                    <p className="text-sm text-gray-500 truncate">
                                                        {sub.description}
                                                    </p>
                                                )}
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs shrink-0 ${
                                                sub.isActive !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                                {sub.isActive !== false ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
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

export default CategoryViewModal;
