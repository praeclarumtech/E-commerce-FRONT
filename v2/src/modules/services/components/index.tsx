import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mdiCogOutline } from "@mdi/js";
import CardBox from "../../_components/CardBox";
import SectionTitleLineWithButton from "../../_components/Section/TitleLineWithButton";
import Table from "../../../shared/components/Table";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getServices, deleteService } from "../api";
import columns from "../columns";
import Button from "../../_components/Button";
import { toast } from "../../_lib/toast";
import type { AxiosError } from "axios";
import type { Service } from "../interface";

function normalizeServicesResponse(res: unknown): {
  items: Service[];
  page: number;
  totalPages: number;
  total: number;
  limit: number;
} | undefined {
  const data = res && typeof res === "object" && "data" in res ? (res as { data?: unknown }).data : res;
  if (!data || typeof data !== "object") return undefined;
  const d = data as { items?: Service[]; page?: number; totalPages?: number; total?: number; limit?: number };
  if (Array.isArray(d.items)) {
    return {
      items: d.items,
      page: d.page ?? 1,
      totalPages: d.totalPages ?? 1,
      total: d.total ?? 0,
      limit: d.limit ?? 10,
    };
  }
  if (Array.isArray(data)) {
    return {
      items: data as Service[],
      page: 1,
      totalPages: 1,
      total: (data as Service[]).length,
      limit: 10,
    };
  }
  return undefined;
}

export default function Services() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [viewService, setViewService] = useState<Service | null>(null);

  const { data: services, refetch, isLoading } = useQuery({
    queryKey: ["services", page],
    queryFn: () => getServices({ params: { page, limit: 10 } }),
    select: (response) => {
      const raw = response.data?.data ?? response.data;
      return normalizeServicesResponse(raw);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      toast.success("Service deleted successfully!");
      refetch();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message ?? "Failed to delete service");
    },
  });

  const serviceColumns = useMemo(
    () =>
      columns((service) => {
        setViewService(service);
      }),
    []
  );

  return (
    <>
      <SectionTitleLineWithButton icon={mdiCogOutline} title="Services" main>
        <Button
          type="button"
          label="Add Service"
          color="info"
          className="py-3 font-medium"
          small
          onClick={() => navigate("/services/add")}
        />
      </SectionTitleLineWithButton>
      <CardBox className="mb-6" hasTable>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-b-blue-600 border-gray-200 dark:border-slate-700" />
          </div>
        ) : services && services.items.length > 0 ? (
          <Table
            data={services}
            columns={serviceColumns}
            onPageChange={(pageIndex) => setPage(pageIndex + 1)}
            onEdit={(row) => navigate(`/services/edit/${(row as Service)._id}`)}
            deleteMutation={deleteMutation}
            deleteModalTitle="Delete Service"
            deleteModalMessage="Are you sure you want to delete this service?"
          />
        ) : (
          <div className="py-12 text-center text-gray-500 dark:text-slate-400">
            No services yet. Click &quot;Add Service&quot; to create one.
          </div>
        )}
      </CardBox>
      {viewService && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/50"
          role="dialog"
          onClick={() => setViewService(null)}
        >
          <div
            className="max-h-[90vh] w-11/12 overflow-y-auto rounded-lg bg-white p-6 shadow-lg dark:bg-slate-800 md:w-2/5"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-2 text-lg font-semibold">{viewService.title as string}</h3>
            {viewService.key && (
              <p className="mb-2 font-mono text-sm text-gray-500 dark:text-slate-400">{viewService.key}</p>
            )}
            {viewService.subtitle && (
              <p className="text-sm text-gray-600 dark:text-slate-400">{viewService.subtitle}</p>
            )}
            <p className="mt-2 text-sm">Icon: {viewService.icon as string}</p>
            <p className="text-sm">Active: {viewService.isActive ? "Yes" : "No"}</p>
            <div className="mt-4 flex justify-end">
              <Button
                type="button"
                label="Close"
                color="whiteDark"
                outline
                onClick={() => setViewService(null)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
