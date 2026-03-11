import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mdiTagOutline } from "@mdi/js";
import CardBox from "../../_components/CardBox";
import SectionTitleLineWithButton from "../../_components/Section/TitleLineWithButton";
import Table from "../../../shared/components/Table";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getBrands, deleteBrand } from "../api";
import columns from "../columns";
import Button from "../../_components/Button";
import { toast } from "../../_lib/toast";
import type { AxiosError } from "axios";
import type { Brand } from "../interface";

function normalizeBrandsResponse(res: unknown): {
  items: Brand[];
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
    items?: Brand[];
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

export default function Brands() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const { data: brands, refetch, isLoading: isLoadingBrands } = useQuery({
    queryKey: ["brands", page],
    queryFn: () => getBrands({ params: { page, limit: 10 } }),
    select: (response) => {
      const raw = response.data?.data ?? response.data;
      return normalizeBrandsResponse(raw);
    },
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

  const brandColumns = useMemo(() => columns(), []);

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
    </>
  );
}
