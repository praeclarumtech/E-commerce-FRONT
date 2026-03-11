import { useMemo, useState } from "react";
import { mdiCartOutline } from "@mdi/js";
import CardBox from "../../_components/CardBox";
import SectionTitleLineWithButton from "../../_components/Section/TitleLineWithButton";
import Table from "../../../shared/components/Table";
import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../api";
import columns from "../columns";
import OrderViewModal from "./OrderViewModal";
import type { Order } from "../interface";

function normalizeOrdersResponse(res: unknown): {
  items: Order[];
  page: number;
  totalPages: number;
  total: number;
  limit: number;
} | undefined {
  const data = res && typeof res === "object" && "data" in res ? (res as { data?: unknown }).data : res;
  if (!data || typeof data !== "object") return undefined;
  const d = data as { items?: Order[]; page?: number; totalPages?: number; total?: number; limit?: number };
  if (!Array.isArray(d.items)) return undefined;
  return {
    items: d.items,
    page: d.page ?? 1,
    totalPages: d.totalPages ?? 1,
    total: d.total ?? 0,
    limit: d.limit ?? 10,
  };
}

export default function Orders() {
  const [page, setPage] = useState(1);
  const [viewOrder, setViewOrder] = useState<Order | null>(null);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders", page],
    queryFn: () => getOrders({ params: { page, limit: 10 } }),
    select: (response) => {
      const raw = response.data?.data ?? response.data;
      return normalizeOrdersResponse(raw);
    },
  });

  const orderColumns = useMemo(() => columns((order) => setViewOrder(order)), []);

  return (
    <>
      <SectionTitleLineWithButton icon={mdiCartOutline} title="Orders" main />
      <CardBox className="mb-6" hasTable>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-b-blue-600 border-gray-200 dark:border-slate-700" />
          </div>
        ) : orders && orders.items.length > 0 ? (
          <Table
            data={orders}
            columns={orderColumns}
            onPageChange={(pageIndex) => setPage(pageIndex + 1)}
          />
        ) : (
          <div className="py-12 text-center text-gray-500 dark:text-slate-400">
            No orders yet.
          </div>
        )}
      </CardBox>
      <OrderViewModal
        isOpen={!!viewOrder}
        onClose={() => setViewOrder(null)}
        order={viewOrder}
      />
    </>
  );
}
