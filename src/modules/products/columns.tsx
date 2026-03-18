import type { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { getImageUrl } from "../../shared/constant";
import { ENUM_PRODUCT_STATUS, type Product } from "./interface";

/** Variant as returned by API (with attributes object); product listing may populate this shape */
type ProductVariantRow = {
  _id?: string;
  attributes?: Record<string, string>;
  name?: string;
  value?: string;
  price?: number;
  stock?: number;
  sku?: string;
};

function formatVariantLabel(v: ProductVariantRow): string {
  if (v.attributes && Object.keys(v.attributes).length > 0) {
    return Object.entries(v.attributes)
      .map(([k, val]) => `${k}: ${val}`)
      .join(", ");
  }
  if (v.name != null && v.value != null) return `${v.name}: ${v.value}`;
  return "—";
}

function getStatusBadge(status: ENUM_PRODUCT_STATUS) {
  const statusConfig: Record<ENUM_PRODUCT_STATUS, string> = {
    [ENUM_PRODUCT_STATUS.DRAFT]: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    [ENUM_PRODUCT_STATUS.SAVED]: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    [ENUM_PRODUCT_STATUS.PUBLISH]: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  };
  return statusConfig[status] ?? "bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-slate-300";
}

type ProductColumnsOptions = {
  onShowInBannerChange?: (product: Product, value: boolean) => void;
  updatingShowInBannerId?: string | null;
};

export default function productColumns(options?: ProductColumnsOptions): ColumnDef<Product>[] {
  const { onShowInBannerChange, updatingShowInBannerId } = options ?? {};
  function getFirstImageSrc(product: Product): string {
    const images = product.images ?? [];
    if (images.length === 0) return "";
    const first = images[0];
    const path = typeof first === "string" ? first : (first as { imageUrl?: string }).imageUrl;
    return path ? getImageUrl(path) : "";
  }

  return [
    { header: "Sr No.", cell: (info) => info.row.index + 1 },
    { header: "Name", accessorKey: "name" },
    {
      header: "Image",
      accessorKey: "images",
      cell: (info) => {
        const src = getFirstImageSrc(info.row.original);
        if (!src) return "—";
        return (
          <img
            src={src}
            alt=""
            className="h-10 w-10 rounded object-cover"
          />
        );
      },
    },
    {
      header: "Price",
      accessorKey: "price",
      cell: (info) => (
        <span className="text-gray-700 dark:text-slate-300">
          ${Number(info.row.original.price).toFixed(2)}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (info) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusBadge(
            info.row.original.status as ENUM_PRODUCT_STATUS
          )}`}
        >
          {info.row.original.status}
        </span>
      ),
    },
    {
      header: "Variants",
      accessorKey: "variants",
      cell: (info) => {
        const variants = (info.row.original.variants ?? []) as ProductVariantRow[];
        if (variants.length === 0) return "—";
        const labels = variants.map(formatVariantLabel).filter((s) => s !== "—");
        if (labels.length === 0) return "—";
        const text = labels.join(" · ");
        return (
          <span className="block truncate" title={text}>
            {text}
          </span>
        );
      },
    },
    {
      header: "Active",
      accessorKey: "isActive",
      cell: (info) => (
        <span
          className={`rounded-full px-2 py-1 text-xs ${
            info.row.original.isActive
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
          }`}
        >
          {info.row.original.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    ...(onShowInBannerChange
      ? [
          {
            header: "Show in banner",
            accessorKey: "showInBanner",
            cell: (info: { row: { original: Product } }) => {
              const product = info.row.original;
              const isUpdating = updatingShowInBannerId === product._id;
              return (
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!!product.showInBanner}
                    disabled={isUpdating}
                    onChange={() => onShowInBannerChange(product, !product.showInBanner)}
                    className="h-4 w-4 rounded border-gray-700 text-blue-600 focus:ring-blue-600 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800"
                  />
                  {isUpdating ? (
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-b-blue-600 border-gray-200 dark:border-slate-700" />
                  ) : null}
                </label>
              );
            },
          } as ColumnDef<Product>,
        ]
      : []),
    {
      header: "Created",
      accessorKey: "createdAt",
      cell: (info) =>
        info.row.original.createdAt
          ? moment(info.row.original.createdAt).format("DD/MM/YYYY")
          : "—",
    },
  ];
}
