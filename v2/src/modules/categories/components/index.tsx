import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mdiFolderOutline } from "@mdi/js";
import CardBox from "../../_components/CardBox";
import SectionTitleLineWithButton from "../../_components/Section/TitleLineWithButton";
import Table from "../../../shared/components/Table";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getCategories, deleteCategory } from "../api";
import columns from "../columns";
import Button from "../../_components/Button";
import { toast } from "../../_lib/toast";
import type { AxiosError } from "axios";
import type { Category } from "../interface";

function normalizeCategoriesResponse(res: unknown): { items: Category[]; page: number; totalPages: number; total: number; limit: number } | undefined {
  const data = res && typeof res === "object" && "data" in res ? (res as { data?: unknown }).data : res;
  if (!data || typeof data !== "object") return undefined;
  const d = data as { items?: Category[]; page?: number; totalPages?: number; total?: number; limit?: number };
  if (!Array.isArray(d.items)) return undefined;
  return {
    items: d.items,
    page: d.page ?? 1,
    totalPages: d.totalPages ?? 1,
    total: d.total ?? 0,
    limit: d.limit ?? 10,
  };
}

export default function Categories() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const { data: categories, refetch, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories", page],
    queryFn: () => getCategories({ params: { page, limit: 10 } }),
    select: (response) => {
      const raw = response.data?.data ?? response.data;
      return normalizeCategoriesResponse(raw);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      toast.success("Category deleted successfully!");
      refetch();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message ?? "Failed to delete category");
    },
  });

  const categoryColumns = useMemo(() => columns(), []);

  return (
    <>
      <SectionTitleLineWithButton icon={mdiFolderOutline} title="Categories" main>
        <Button
          type="button"
          label="Add Category"
          color="info"
          className="py-3 font-medium"
          small
          onClick={() => navigate("/categories/add")}
        />
      </SectionTitleLineWithButton>
      <CardBox className="mb-6" hasTable>
        {isLoadingCategories ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-b-blue-600 border-gray-200 dark:border-slate-700" />
          </div>
        ) : categories && categories.items.length > 0 ? (
          <Table
            data={categories}
            columns={categoryColumns}
            onPageChange={(pageIndex) => setPage(pageIndex + 1)}
            onEdit={(row) => navigate(`/categories/edit/${(row as Category)._id}`)}
            deleteMutation={deleteMutation}
            deleteModalTitle="Delete Category"
            deleteModalMessage="Are you sure you want to delete this category? This may affect subcategories."
          />
        ) : (
          <div className="py-12 text-center text-gray-500 dark:text-slate-400">
            No categories yet. Click &quot;Add Category&quot; to create one.
          </div>
        )}
      </CardBox>
    </>
  );
}
