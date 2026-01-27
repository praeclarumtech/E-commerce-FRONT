import { useState, useCallback } from "react";
import { Plus, Pencil, Trash2, Package, ImageIcon } from "lucide-react";
import { LocalVariant } from "./ProductForm";
import LocalVariantFormModal from "./LocalVariantFormModal";

type Props = {
  variants: LocalVariant[];
  onAdd: (variant: LocalVariant) => void;
  onUpdate: (variant: LocalVariant) => void;
  onRemove: (variantId: string) => void;
};

function LocalVariantSection({ variants, onAdd, onUpdate, onRemove }: Props) {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<LocalVariant | null>(null);

  const handleAddClick = useCallback(() => {
    setSelectedVariant(null);
    setIsFormModalOpen(true);
  }, []);

  const handleEditClick = useCallback((variant: LocalVariant) => {
    setSelectedVariant(variant);
    setIsFormModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsFormModalOpen(false);
    setSelectedVariant(null);
  }, []);

  const handleSave = useCallback(
    (variant: LocalVariant) => {
      if (selectedVariant) {
        onUpdate(variant);
      } else {
        onAdd(variant);
      }
      handleCloseModal();
    },
    [selectedVariant, onAdd, onUpdate, handleCloseModal]
  );

  // Format attributes for display
  const formatAttributes = (attributes: Record<string, string | number>) => {
    return Object.entries(attributes)
      .map(([key, value]) => `${key}: ${value}`)
      .join(" | ");
  };

  // Get first image preview
  const getImagePreview = (variant: LocalVariant) => {
    if (variant.images.length === 0) return null;
    return URL.createObjectURL(variant.images[0]);
  };

  return (
    <div className="mt-8 border-t border-gray-200 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-brand-600" />
          <h3 className="text-lg font-semibold text-gray-900">Product Variants</h3>
          <span className="text-sm text-gray-500">({variants.length})</span>
        </div>
        <button
          type="button"
          onClick={handleAddClick}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Variant
        </button>
      </div>

      {/* Info Banner */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-700">
          <span className="font-medium">Note:</span> Variants will be created after saving the product.
        </p>
      </div>

      {/* Variants List */}
      {variants.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No variants added yet</p>
          <p className="text-gray-400 text-xs mt-1">
            Add variants to offer different options like sizes or colors
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {variants.map((variant) => {
            const imagePreview = getImagePreview(variant);
            return (
              <div
                key={variant.id}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
              >
                {/* Variant Image */}
                <div className="shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-white border border-gray-200">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Variant"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ImageIcon className="h-6 w-6" />
                    </div>
                  )}
                </div>

                {/* Variant Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate mb-1">
                    {formatAttributes(variant.attributes)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>
                      Price: <span className="font-medium text-gray-700">${variant.price}</span>
                    </span>
                    <span>
                      Stock: <span className="font-medium text-gray-700">{variant.stock}</span>
                    </span>
                    {variant.images.length > 0 && (
                      <span>
                        Images: <span className="font-medium text-gray-700">{variant.images.length}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleEditClick(variant)}
                    className="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                    title="Edit variant"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemove(variant.id)}
                    className="p-2 text-gray-400 hover:text-error-600 hover:bg-error-50 rounded-lg transition-colors"
                    title="Delete variant"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Form Modal */}
      <LocalVariantFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        variant={selectedVariant}
      />
    </div>
  );
}

export default LocalVariantSection;
