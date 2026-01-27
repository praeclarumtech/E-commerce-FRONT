import { useState, useCallback, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";

import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import ImageUpload from "../../../components/form/ImageUpload";
import { LocalVariant } from "./ProductForm";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (variant: LocalVariant) => void;
  variant?: LocalVariant | null;
};

function LocalVariantFormModal({ isOpen, onClose, onSave, variant }: Props) {
  const isEditMode = !!variant;

  const [attributes, setAttributes] = useState<{ key: string; value: string }[]>([
    { key: "", value: "" },
  ]);
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate form when editing
  useEffect(() => {
    if (variant) {
      const attrs = Object.entries(variant.attributes).map(([key, value]) => ({
        key,
        value: String(value),
      }));
      setAttributes(attrs.length > 0 ? attrs : [{ key: "", value: "" }]);
      setPrice(variant.price);
      setStock(variant.stock);
      setImageFiles(variant.images);
    } else {
      // Reset form for create mode
      setAttributes([{ key: "", value: "" }]);
      setPrice(0);
      setStock(0);
      setImageFiles([]);
    }
    setErrors({});
  }, [variant, isOpen]);

  const handleImagesChange = useCallback((files: File[]) => {
    setImageFiles(files);
  }, []);

  const addAttribute = () => {
    setAttributes([...attributes, { key: "", value: "" }]);
  };

  const removeAttribute = (index: number) => {
    if (attributes.length > 1) {
      setAttributes(attributes.filter((_, i) => i !== index));
    }
  };

  const updateAttribute = (index: number, field: "key" | "value", value: string) => {
    const updated = [...attributes];
    updated[index][field] = value;
    setAttributes(updated);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Check for at least one valid attribute
    const validAttributes = attributes.filter((attr) => attr.key.trim() && attr.value.trim());
    if (validAttributes.length === 0) {
      newErrors.attributes = "At least one attribute is required";
    }

    // Check for duplicate keys
    const keys = validAttributes.map((a) => a.key.toLowerCase());
    if (new Set(keys).size !== keys.length) {
      newErrors.attributes = "Duplicate attribute keys are not allowed";
    }

    if (price < 0) {
      newErrors.price = "Price must be 0 or greater";
    }

    if (stock < 0) {
      newErrors.stock = "Stock must be 0 or greater";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    // Convert attributes array to object
    const attributesObject = attributes
      .filter((attr) => attr.key.trim() && attr.value.trim())
      .reduce((acc, attr) => {
        acc[attr.key.trim()] = attr.value.trim();
        return acc;
      }, {} as Record<string, string>);

    const localVariant: LocalVariant = {
      id: variant?.id || `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      attributes: attributesObject,
      price,
      stock,
      images: imageFiles,
    };

    onSave(localVariant);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl my-8 max-h-[calc(100vh-4rem)] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {isEditMode ? "Edit Variant" : "Add New Variant"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Define attributes like size, color, etc.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1">
          {/* Attributes Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <Label>
                Attributes<span className="text-error-500">*</span>
              </Label>
              <button
                type="button"
                onClick={addAttribute}
                className="flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700 font-medium"
              >
                <Plus className="h-4 w-4" />
                Add Attribute
              </button>
            </div>

            <div className="space-y-3">
              {attributes.map((attr, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-1">
                    <Input
                      placeholder="Key (e.g., Color, Size)"
                      type="text"
                      value={attr.key}
                      onChange={(e) => updateAttribute(index, "key", e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      placeholder="Value (e.g., Red, XL)"
                      type="text"
                      value={attr.value}
                      onChange={(e) => updateAttribute(index, "value", e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAttribute(index)}
                    disabled={attributes.length === 1}
                    className="p-2.5 text-gray-400 hover:text-error-500 hover:bg-error-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {errors.attributes && (
              <p className="text-error-500 text-sm mt-2">{errors.attributes}</p>
            )}
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <Label>Price</Label>
              <Input
                placeholder="Enter price"
                type="number"
                min={0}
                step={0.01}
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
              />
              {errors.price && (
                <p className="text-error-500 text-sm mt-1">{errors.price}</p>
              )}
            </div>
            <div>
              <Label>Stock</Label>
              <Input
                placeholder="Enter stock quantity"
                type="number"
                min={0}
                step={1}
                value={stock}
                onChange={(e) => setStock(parseInt(e.target.value) || 0)}
              />
              {errors.stock && (
                <p className="text-error-500 text-sm mt-1">{errors.stock}</p>
              )}
            </div>
          </div>

          {/* Images */}
          <div className="mb-6">
            <Label>Variant Images</Label>
            <ImageUpload
              onChange={handleImagesChange}
              maxFiles={10}
              maxSizeInMB={5}
            />
            {isEditMode && imageFiles.length > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                {imageFiles.length} image(s) attached
              </p>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-6 py-2.5 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition-colors"
          >
            {isEditMode ? "Update Variant" : "Add Variant"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LocalVariantFormModal;
