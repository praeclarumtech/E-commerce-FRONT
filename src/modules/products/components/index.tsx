import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mdiPackageVariant } from "@mdi/js";
import CardBox from "../../_components/CardBox";
import SectionTitleLineWithButton from "../../_components/Section/TitleLineWithButton";
import Table from "../../../shared/components/Table";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getProducts, deleteProduct, getProductById } from "../api";
import columns from "../columns";
import Button from "../../_components/Button";
import { toast } from "../../_lib/toast";
import type { AxiosError } from "axios";
import type { Product } from "../interface";
import ViewProductModal from "./ViewProductModal";

function normalizeProductsResponse(res: unknown): {
  items: Product[];
  page: number;
  totalPages: number;
  total: number;
  limit: number;
} | undefined {
  const data =
    res && typeof res === "object" && "data" in res
      ? (res as { data?: unknown }).data
      : res;
  if (!data || typeof data !== "object") return undefined;
  const d = data as {
    items?: Product[];
    page?: number;
    totalPages?: number;
    total?: number;
    limit?: number;
  };
  if (!Array.isArray(d.items)) return undefined;
  return {
    items: d.items,
    page: d.page ?? 1,
    totalPages: d.totalPages ?? 1,
    total: d.total ?? 0,
    limit: d.limit ?? 10,
  };
}

export default function Products() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [viewProductId, setViewProductId] = useState<string | null>(null);

  const { data: products, refetch, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products", page],
    queryFn: () => getProducts({ params: { page, limit: 10 } }),
    select: (response) => {
      const raw = response.data?.data ?? response.data;
      return normalizeProductsResponse(raw);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      toast.success("Product deleted successfully!");
      refetch();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message ?? "Failed to delete product");
    },
  });

  const productColumns = useMemo(() => columns(), []);

  const { data: viewProductData } = useQuery({
    queryKey: ["product", viewProductId],
    queryFn: () => getProductById(viewProductId!),
    enabled: !!viewProductId,
    select: (res) => res.data?.data as Product | undefined,
  });

  const productToView = viewProductId ? (viewProductData ?? viewProduct) : null;

  return (
    <>
      <SectionTitleLineWithButton icon={mdiPackageVariant} title="Products" main>
        <Button
          type="button"
          label="Add Product"
          color="info"
          className="py-3 font-medium"
          small
          onClick={() => navigate("/products/add")}
        />
      </SectionTitleLineWithButton>
      <CardBox className="mb-6" hasTable>
        {isLoadingProducts ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-b-blue-600 border-gray-200 dark:border-slate-700" />
          </div>
        ) : products && products.items.length > 0 ? (
          <Table
            data={products}
            columns={productColumns}
            onPageChange={(pageIndex) => setPage(pageIndex + 1)}
            onView={(row) => {
              const p = row as Product;
              setViewProduct(p);
              setViewProductId(p._id);
            }}
            onEdit={(row) => navigate(`/products/edit/${(row as Product)._id}`)}
            deleteMutation={deleteMutation}
            deleteModalTitle="Delete Product"
            deleteModalMessage="Are you sure you want to delete this product?"
          />
        ) : (
          <div className="py-12 text-center text-gray-500 dark:text-slate-400">
            No products yet. Click &quot;Add Product&quot; to create one.
          </div>
        )}
      </CardBox>

      {productToView && (
        <ViewProductModal
          product={viewProductData ?? productToView}
          onClose={() => {
            setViewProduct(null);
            setViewProductId(null);
          }}
        />
      )}
    </>
  );
}
