import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mdiPercentBoxOutline } from "@mdi/js";
import CardBox from "../../_components/CardBox";
import SectionTitleLineWithButton from "../../_components/Section/TitleLineWithButton";
import Table from "../../../shared/components/Table";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getOffers, deleteOffer } from "../api";
import columns from "../columns";
import Button from "../../_components/Button";
import { toast } from "../../_lib/toast";
import type { AxiosError } from "axios";
import type { Offer } from "../interface";

function normalizeOffersResponse(res: unknown): {
  items: Offer[];
  page: number;
  totalPages: number;
  total: number;
  limit: number;
} | undefined {
  const data = res && typeof res === "object" && "data" in res ? (res as { data?: unknown }).data : res;
  if (!data || typeof data !== "object") return undefined;
  const d = data as { items?: Offer[]; page?: number; totalPages?: number; total?: number; limit?: number };
  if (!Array.isArray(d.items)) return undefined;
  return {
    items: d.items,
    page: d.page ?? 1,
    totalPages: d.totalPages ?? 1,
    total: d.total ?? 0,
    limit: d.limit ?? 10,
  };
}

export default function Offers() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [viewOffer, setViewOffer] = useState<Offer | null>(null);

  const { data: offers, refetch, isLoading } = useQuery({
    queryKey: ["offers", page],
    queryFn: () => getOffers({ params: { page, limit: 10 } }),
    select: (response) => {
      const raw = response.data?.data ?? response.data;
      return normalizeOffersResponse(raw);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteOffer,
    onSuccess: () => {
      toast.success("Offer deleted successfully!");
      refetch();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message ?? "Failed to delete offer");
    },
  });

  const offerColumns = useMemo(
    () =>
      columns((offer) => {
        setViewOffer(offer);
      }),
    []
  );

  return (
    <>
      <SectionTitleLineWithButton icon={mdiPercentBoxOutline} title="Offers" main>
        <Button
          type="button"
          label="Add Offer"
          color="info"
          className="py-3 font-medium"
          small
          onClick={() => navigate("/offers/add")}
        />
      </SectionTitleLineWithButton>
      <CardBox className="mb-6" hasTable>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-b-blue-600 border-gray-200 dark:border-slate-700" />
          </div>
        ) : offers && offers.items.length > 0 ? (
          <Table
            data={offers}
            columns={offerColumns}
            onPageChange={(pageIndex) => setPage(pageIndex + 1)}
            onEdit={(row) => navigate(`/offers/edit/${(row as Offer)._id}`)}
            deleteMutation={deleteMutation}
            deleteModalTitle="Delete Offer"
            deleteModalMessage="Are you sure you want to delete this offer?"
          />
        ) : (
          <div className="py-12 text-center text-gray-500 dark:text-slate-400">
            No offers yet. Click &quot;Add Offer&quot; to create one.
          </div>
        )}
      </CardBox>
      {viewOffer && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/50"
          role="dialog"
          onClick={() => setViewOffer(null)}
        >
          <div
            className="max-h-[90vh] w-11/12 overflow-y-auto rounded-lg bg-white p-6 shadow-lg dark:bg-slate-800 md:w-2/5"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-2 text-lg font-semibold">{viewOffer.name as string}</h3>
            <p className="text-sm text-gray-600 dark:text-slate-400">
              Type: {viewOffer.type as string} | Value: {String(viewOffer.value ?? "—")}
            </p>
            <p className="mt-2 text-sm">Active: {viewOffer.isActive ? "Yes" : "No"}</p>
            <div className="mt-4 flex justify-end">
              <Button
                type="button"
                label="Close"
                color="whiteDark"
                outline
                onClick={() => setViewOffer(null)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
