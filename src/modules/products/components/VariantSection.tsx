import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { Plus, Pencil, Trash2, Package, ImageIcon, Star } from "lucide-react";

import { getVariantsByProduct, deleteVariant } from "../variantApi";
import { Variant } from "../type";
import { getImageUrl } from "../../../shared/constant";
import VariantFormModal from "./VariantFormModal";
import DeleteVariantModal from "./DeleteVariantModal";

type Props = {
  productId: string;
};

function VariantSection({ productId }: Props) {
  const queryClient = useQueryClient();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [variantToDelete, setVariantToDelete] = useState<Variant | null>(null);

  // Fetch variants - only when productId is valid
  const { data: variants = [], isLoading } = useQuery({
    queryKey: ["variants", productId],
    queryFn: () => getVariantsByProduct(productId),
    select: (response) => response.data.data || [],
    enabled: !!productId && productId !== "undefined",
  });

  // Delete mutation
  const { isPending: isDeleting, mutate: deleteMutate } = useMutation({
    mutationFn: deleteVariant,
    onSuccess: () => {
      toast.success("Variant deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["variants", productId] });
      setIsDeleteModalOpen(false);
      setVariantToDelete(null);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error?.response?.data?.message || "Failed to delete variant");
    },
  });

  const handleAddClick = useCallback(() => {
    setSelectedVariant(null);
    setIsFormModalOpen(true);
  }, []);

  const handleEditClick = useCallback((variant: Variant) => {
    setSelectedVariant(variant);
    setIsFormModalOpen(true);
  }, []);

  const handleDeleteClick = useCallback((variant: Variant) => {
    setVariantToDelete(variant);
    setIsDeleteModalOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (variantToDelete) {
      deleteMutate(variantToDelete._id);
    }
  }, [variantToDelete, deleteMutate]);

  const handleCloseFormModal = useCallback(() => {
    setIsFormModalOpen(false);
    setSelectedVariant(null);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
    setVariantToDelete(null);
  }, []);

  // Format attributes for display
  const formatAttributes = (attributes: Record<string, string | number>) => {
    return Object.entries(attributes)
      .map(([key, value]) => `${key}: ${value}`)
      .join(" | ");
  };

  // Get primary image or first image
  const getVariantImage = (variant: Variant) => {
    if (!variant.images || variant.images.length === 0) return null;
    const primaryImage = variant.images.find((img) => img.isPrimary);
    return primaryImage?.imageUrl || variant.images[0]?.imageUrl;
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

      {/* Variants List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
        </div>
      ) : variants.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No variants yet</p>
          <p className="text-gray-400 text-xs mt-1">
            Add variants to offer different options like sizes or colors
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {variants.map((variant) => {
            const imageUrl = getVariantImage(variant);
            return (
              <div
                key={variant._id}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
              >
                {/* Variant Image */}
                <div className="shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-white border border-gray-200">
                  {imageUrl ? (
                    <img
                      src={getImageUrl(imageUrl)}
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
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900 truncate">
                      {formatAttributes(variant.attributes)}
                    </span>
                    {variant.images?.some((img) => img.isPrimary) && (
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500 shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>
                      Price: <span className="font-medium text-gray-700">${variant.price || 0}</span>
                    </span>
                    <span>
                      Stock: <span className="font-medium text-gray-700">{variant.stock || 0}</span>
                    </span>
                    {variant.images && variant.images.length > 0 && (
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
                    onClick={() => handleDeleteClick(variant)}
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
      <VariantFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        productId={productId}
        variant={selectedVariant}
      />

      {/* Delete Modal */}
      <DeleteVariantModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        variantAttributes={variantToDelete ? formatAttributes(variantToDelete.attributes) : ""}
      />
    </div>
  );
}

export default VariantSection;
