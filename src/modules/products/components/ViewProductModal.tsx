import { mdiClose } from "@mdi/js";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import Button from "../../_components/Button";
import CardBox from "../../_components/CardBox";
import OverlayLayer from "../../_components/OverlayLayer";
import { getImageUrl } from "../../../shared/constant";
import { getVariantsByProductId, type VariantResponse } from "../api";
import type { Product } from "../interface";

type Props = {
  product: Product | null;
  onClose: () => void;
};

function getCategoryName(categoryId: Product["categoryId"]): string {
  if (!categoryId) return "—";
  if (typeof categoryId === "object" && "name" in categoryId) return (categoryId as { name?: string }).name ?? "—";
  return String(categoryId);
}

function getSubCategoryName(subCategoryId: Product["subCategoryId"]): string {
  if (!subCategoryId) return "—";
  if (typeof subCategoryId === "object" && "name" in subCategoryId) return (subCategoryId as { name?: string }).name ?? "—";
  return String(subCategoryId);
}

export default function ViewProductModal({ product, onClose }: Props) {
  const { data: variants = [] } = useQuery({
    queryKey: ["variants", product?._id],
    queryFn: () => getVariantsByProductId(product!._id),
    enabled: !!product?._id,
    select: (res) => (res.data?.data ?? res.data ?? []) as VariantResponse[],
  });

  if (!product) return null;

  const categoryName = getCategoryName(product.categoryId);
  const subCategoryName = getSubCategoryName(product.subCategoryId);
  const images = product.images ?? [];
  const imageList = Array.isArray(images) ? images : [];

  return (
    <OverlayLayer onClick={onClose}>
      <CardBox
        className="z-50 max-h-[90vh] w-11/12 max-w-2xl animate-fade-in overflow-y-auto shadow-lg"
        isModal
        footer={
          <div className="flex justify-end">
            <Button label="Close" color="whiteDark" outline onClick={onClose} />
          </div>
        }
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">View Product</h2>
          <Button icon={mdiClose} color="whiteDark" onClick={onClose} small roundedFull />
        </div>

        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase text-gray-500 dark:text-slate-400">Name</p>
              <p className="mt-0.5 text-gray-900 dark:text-slate-100">{product.name ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-gray-500 dark:text-slate-400">Price</p>
              <p className="mt-0.5 text-gray-900 dark:text-slate-100">${Number(product.price).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-gray-500 dark:text-slate-400">Status</p>
              <p className="mt-0.5 text-gray-900 dark:text-slate-100">{product.status ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-gray-500 dark:text-slate-400">Active</p>
              <p className="mt-0.5 text-gray-900 dark:text-slate-100">{product.isActive ? "Yes" : "No"}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-gray-500 dark:text-slate-400">Category</p>
              <p className="mt-0.5 text-gray-900 dark:text-slate-100">{categoryName}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-gray-500 dark:text-slate-400">Subcategory</p>
              <p className="mt-0.5 text-gray-900 dark:text-slate-100">{subCategoryName}</p>
            </div>
            {product.brandName && (
              <div>
                <p className="text-xs font-medium uppercase text-gray-500 dark:text-slate-400">Brand</p>
                <p className="mt-0.5 text-gray-900 dark:text-slate-100">{product.brandName}</p>
              </div>
            )}
            {product.rating != null && (
              <div>
                <p className="text-xs font-medium uppercase text-gray-500 dark:text-slate-400">Rating</p>
                <p className="mt-0.5 text-gray-900 dark:text-slate-100">{product.rating}</p>
              </div>
            )}
          </div>

          {product.description && (
            <div>
              <p className="text-xs font-medium uppercase text-gray-500 dark:text-slate-400">Description</p>
              <p className="mt-0.5 text-gray-900 dark:text-slate-100">{product.description}</p>
            </div>
          )}

          <div>
            <p className="text-xs font-medium uppercase text-gray-500 dark:text-slate-400">Variants</p>
            {variants.length > 0 ? (
              <ul className="mt-2 space-y-4">
                {variants.map((v) => (
                  <li
                    key={v._id}
                    className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-slate-600 dark:bg-slate-800/50"
                  >
                    <div className="flex flex-wrap items-start gap-4">
                      {v.images && v.images.length > 0 && (
                        <div className="flex flex-shrink-0 gap-1">
                          {v.images.map((img) => (
                            <img
                              key={img._id ?? img.imageUrl}
                              src={getImageUrl(img.imageUrl)}
                              alt=""
                              className="h-16 w-16 rounded border border-gray-200 object-cover dark:border-slate-600"
                            />
                          ))}
                        </div>
                      )}
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-gray-900 dark:text-slate-100">
                          <span className="font-medium">${Number(v.price).toFixed(2)}</span>
                          <span>Stock: {v.stock}</span>
                        </div>
                        {v.attributes && Object.keys(v.attributes).length > 0 && (
                          <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-sm text-gray-600 dark:text-slate-400">
                            {Object.entries(v.attributes).map(([key, value]) => (
                              <span key={key}>
                                <span className="font-medium">{key}:</span> {value}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-gray-500 dark:text-slate-400">No variants for this product.</p>
            )}
          </div>

          {(product.comment ?? "").trim() && (
            <div>
              <p className="text-xs font-medium uppercase text-gray-500 dark:text-slate-400">Comment</p>
              <p className="mt-0.5 text-gray-900 dark:text-slate-100">{product.comment}</p>
            </div>
          )}

          {imageList.length > 0 && (
            <div>
              <p className="text-xs font-medium uppercase text-gray-500 dark:text-slate-400">Images</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {imageList.map((img: { _id?: string; imageUrl?: string } | string, idx: number) => {
                  const url = typeof img === "string" ? getImageUrl(img) : getImageUrl((img as { imageUrl?: string }).imageUrl ?? "");
                  return (
                    <img
                      key={(img as { _id?: string })._id ?? idx}
                      src={url}
                      alt=""
                      className="h-20 w-20 rounded-lg border border-gray-200 object-cover dark:border-slate-600"
                    />
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 border-t border-gray-200 pt-4 dark:border-slate-700 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase text-gray-500 dark:text-slate-400">Created</p>
              <p className="mt-0.5 text-gray-900 dark:text-slate-100">
                {product.createdAt ? moment(product.createdAt).format("DD/MM/YYYY HH:mm") : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-gray-500 dark:text-slate-400">Updated</p>
              <p className="mt-0.5 text-gray-900 dark:text-slate-100">
                {product.updatedAt ? moment(product.updatedAt).format("DD/MM/YYYY HH:mm") : "—"}
              </p>
            </div>
          </div>
        </div>
      </CardBox>
    </OverlayLayer>
  );
}
