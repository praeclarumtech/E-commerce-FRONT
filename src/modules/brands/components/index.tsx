import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mdiTagOutline } from "@mdi/js";
import CardBox from "../../_components/CardBox";
import CardBoxModal from "../../_components/CardBox/Modal";
import SectionTitleLineWithButton from "../../_components/Section/TitleLineWithButton";
import Table from "../../../shared/components/Table";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getBrands, getBrandById, deleteBrand } from "../api";
import columns from "../columns";
import Button from "../../_components/Button";
import { toast } from "../../_lib/toast";
import { getImageUrl } from "../../../shared/constant";
import type { AxiosError } from "axios";
import type { Brand, BrandImage } from "../interface";

function normalizeBrandsResponse(res: unknown): {
  items: Brand[];
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
} | undefined {
  const data =
    res && typeof res === "object" && "data" in res
      ? (res as { data?: unknown }).data
      : res;
  if (!data || typeof data !== "object") return undefined;
  const d = data as {
    items?: Brand[];
    page?: number;
    totalPages?: number;
    total?: number;
    limit?: number;
  };
  if (!Array.isArray(d.items)) return undefined;
  const page = d.page ?? 1;
  const totalPages = d.totalPages ?? 1;
  return {
    items: d.items,
    page,
    totalPages,
    total: d.total ?? 0,
    limit: d.limit ?? 10,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

export default function Brands() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);

  const { data: brands, refetch, isLoading: isLoadingBrands } = useQuery({
    queryKey: ["brands", page],
    queryFn: () => getBrands({ params: { page, limit: 10 } }),
    select: (response) => {
      const raw = response.data?.data ?? response.data;
      return normalizeBrandsResponse(raw);
    },
  });

  const { data: selectedBrand, isLoading: isLoadingSelectedBrand } = useQuery({
    queryKey: ["brand", selectedBrandId],
    queryFn: () => getBrandById(selectedBrandId!),
    enabled: !!selectedBrandId,
    select: (response) => (response.data as { data?: Brand }).data ?? response.data,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBrand,
    onSuccess: () => {
      toast.success("Brand deleted successfully!");
      refetch();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message ?? "Failed to delete brand");
    },
  });

  const closeBrandModal = useCallback(() => setSelectedBrandId(null), []);
  const onNameClick = useCallback((brand: Brand) => setSelectedBrandId(brand._id), []);
  const brandColumns = useMemo(() => columns(onNameClick), [onNameClick]);

  return (
    <>
      <SectionTitleLineWithButton icon={mdiTagOutline} title="Brands" main>
        <Button
          type="button"
          label="Add Brand"
          color="info"
          className="py-3 font-medium"
          small
          onClick={() => navigate("/brands/add")}
        />
      </SectionTitleLineWithButton>
      <CardBox className="mb-6" hasTable>
        {isLoadingBrands ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-b-blue-600 border-gray-200 dark:border-slate-700" />
          </div>
        ) : brands && brands.items.length > 0 ? (
          <Table
            data={brands}
            columns={brandColumns}
            onPageChange={(pageIndex) => setPage(pageIndex + 1)}
            onEdit={(row) => navigate(`/brands/edit/${(row as Brand)._id}`)}
            deleteMutation={deleteMutation}
            deleteModalTitle="Delete Brand"
            deleteModalMessage="Are you sure you want to delete this brand?"
          />
        ) : (
          <div className="py-12 text-center text-gray-500 dark:text-slate-400">
            No brands yet. Click &quot;Add Brand&quot; to create one.
          </div>
        )}
      </CardBox>

      <CardBoxModal
        title="Brand details"
        buttonLabel="Close"
        buttonColor="info"
        isActive={!!selectedBrandId}
        onConfirm={closeBrandModal}
      >
        {isLoadingSelectedBrand ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-b-blue-600 border-gray-200 dark:border-slate-700" />
          </div>
        ) : selectedBrand ? (
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-slate-400">
                Name
              </p>
              <p className="mt-0.5 text-gray-900 dark:text-slate-100">
                {(selectedBrand as Brand).brandName ?? "—"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-slate-400">
                Description
              </p>
              <p className="mt-0.5 whitespace-pre-wrap text-gray-900 dark:text-slate-100">
                {(selectedBrand as Brand).description?.trim() ?? "—"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-slate-400">
                Images
              </p>
              <div className="mt-2 flex flex-wrap gap-3">
                {((selectedBrand as Brand).images?.length ?? 0) > 0 ? (
                  ((selectedBrand as Brand).images as BrandImage[]).map((img) => (
                    <img
                      key={img._id ?? img.imageUrl}
                      src={getImageUrl(img.imageUrl)}
                      alt=""
                      className="h-20 w-20 rounded-lg border border-gray-200 object-cover dark:border-slate-600"
                    />
                  ))
                ) : (
                  <p className="text-sm text-gray-500 dark:text-slate-400">No images</p>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </CardBoxModal>
    </>
  );
}
