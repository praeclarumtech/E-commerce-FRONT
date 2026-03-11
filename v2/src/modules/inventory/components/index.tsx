import { useState } from "react";
import { mdiPackageVariant, mdiPlus, mdiMinus, mdiRotateLeft } from "@mdi/js";
import CardBox from "../../_components/CardBox";
import SectionTitleLineWithButton from "../../_components/Section/TitleLineWithButton";
import FormField from "../../_components/FormField";
import Button from "../../_components/Button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getInventoryByVariant, reserveInventory, releaseInventory, deductInventory } from "../api";
import { toast } from "../../_lib/toast";
import type { AxiosError } from "axios";
import type { InventoryRecord } from "../interface";

export default function Inventory() {
  const queryClient = useQueryClient();
  const [variantId, setVariantId] = useState("");
  const [reserveQty, setReserveQty] = useState("");
  const [releaseQty, setReleaseQty] = useState("");
  const [deductQty, setDeductQty] = useState("");

  const { data: inventory, isLoading, isFetching, refetch, isSuccess } = useQuery({
    queryKey: ["inventory", variantId],
    queryFn: () => getInventoryByVariant(variantId),
    enabled: !!variantId.trim(),
    select: (response) => (response.data as { data?: InventoryRecord }).data ?? response.data,
  });

  const reserveMutation = useMutation({
    mutationFn: () => reserveInventory(variantId, { quantity: Number(reserveQty) }),
    onSuccess: () => {
      toast.success("Inventory reserved.");
      setReserveQty("");
      queryClient.invalidateQueries({ queryKey: ["inventory", variantId] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error?.response?.data?.message ?? "Failed to reserve.");
    },
  });

  const releaseMutation = useMutation({
    mutationFn: () => releaseInventory(variantId, { quantity: Number(releaseQty) }),
    onSuccess: () => {
      toast.success("Inventory released.");
      setReleaseQty("");
      queryClient.invalidateQueries({ queryKey: ["inventory", variantId] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error?.response?.data?.message ?? "Failed to release.");
    },
  });

  const deductMutation = useMutation({
    mutationFn: () => deductInventory(variantId, { quantity: Number(deductQty) }),
    onSuccess: () => {
      toast.success("Inventory deducted.");
      setDeductQty("");
      queryClient.invalidateQueries({ queryKey: ["inventory", variantId] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error?.response?.data?.message ?? "Failed to deduct.");
    },
  });

  const record = inventory as InventoryRecord | undefined;
  const loading = isLoading || isFetching;

  return (
    <>
      <SectionTitleLineWithButton icon={mdiPackageVariant} title="Inventory" main />
      <CardBox>
        <p className="mb-6 text-sm text-gray-500 dark:text-slate-400">
          View inventory by variant and use reserve, release, or deduct.
        </p>

        <FormField label="Variant ID">
          {({ className }) => (
            <input
              type="text"
              placeholder="Enter variant ID"
              value={variantId}
              onChange={(e) => setVariantId(e.target.value)}
              className={className}
            />
          )}
        </FormField>

        {variantId.trim() && (
          <>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-b-blue-600 border-gray-200 dark:border-slate-700" />
              </div>
            ) : isSuccess && record ? (
              <>
                <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="font-medium text-gray-900 dark:text-slate-100">Inventory for variant</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div>
                      <p className="text-xs font-medium uppercase text-gray-500 dark:text-slate-400">Variant ID</p>
                      <p className="mt-1 truncate font-mono text-sm text-gray-900 dark:text-slate-200" title={record.variantId as string}>
                        {record.variantId ?? "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase text-gray-500 dark:text-slate-400">Quantity</p>
                      <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-slate-200">
                        {record.quantity ?? 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase text-gray-500 dark:text-slate-400">Reserved</p>
                      <p className="mt-1 text-lg font-semibold text-amber-600 dark:text-amber-400">
                        {record.reserved ?? 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase text-gray-500 dark:text-slate-400">Available</p>
                      <p className="mt-1 text-lg font-semibold text-green-600 dark:text-green-400">
                        {record.available ?? (Number(record.quantity ?? 0) - Number(record.reserved ?? 0))}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-lg border border-gray-200 p-4 dark:border-slate-700">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="font-medium text-gray-900 dark:text-slate-200">Reserve</span>
                    </div>
                    <p className="mb-2 text-xs text-gray-500 dark:text-slate-400">Hold quantity for an order.</p>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min={1}
                        placeholder="Qty"
                        value={reserveQty}
                        onChange={(e) => setReserveQty(e.target.value)}
                        className="h-12 w-24 rounded-sm border border-gray-700 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-800"
                      />
                      <Button
                        icon={mdiPlus}
                        label={reserveMutation.isPending ? "..." : "Reserve"}
                        color="info"
                        small
                        disabled={!reserveQty || reserveMutation.isPending}
                        onClick={() => reserveMutation.mutate()}
                      />
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-200 p-4 dark:border-slate-700">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="font-medium text-gray-900 dark:text-slate-200">Release</span>
                    </div>
                    <p className="mb-2 text-xs text-gray-500 dark:text-slate-400">Return reserved quantity.</p>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min={1}
                        placeholder="Qty"
                        value={releaseQty}
                        onChange={(e) => setReleaseQty(e.target.value)}
                        className="h-12 w-24 rounded-sm border border-gray-700 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-800"
                      />
                      <Button
                        icon={mdiRotateLeft}
                        label={releaseMutation.isPending ? "..." : "Release"}
                        color="warning"
                        small
                        disabled={!releaseQty || releaseMutation.isPending}
                        onClick={() => releaseMutation.mutate()}
                      />
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-200 p-4 dark:border-slate-700">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="font-medium text-gray-900 dark:text-slate-200">Deduct</span>
                    </div>
                    <p className="mb-2 text-xs text-gray-500 dark:text-slate-400">Reduce stock (e.g. after sale).</p>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min={1}
                        placeholder="Qty"
                        value={deductQty}
                        onChange={(e) => setDeductQty(e.target.value)}
                        className="h-12 w-24 rounded-sm border border-gray-700 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-800"
                      />
                      <Button
                        icon={mdiMinus}
                        label={deductMutation.isPending ? "..." : "Deduct"}
                        color="danger"
                        small
                        disabled={!deductQty || deductMutation.isPending}
                        onClick={() => deductMutation.mutate()}
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-6 text-center dark:border-slate-700 dark:bg-slate-800/50">
                <p className="text-sm text-gray-500 dark:text-slate-400">No inventory found for this variant.</p>
              </div>
            )}
          </>
        )}

        {!variantId.trim() && (
          <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-8 text-center dark:border-slate-700 dark:bg-slate-800/50">
            <p className="text-sm text-gray-500 dark:text-slate-400">
              Enter a variant ID above to view and manage inventory.
            </p>
          </div>
        )}
      </CardBox>
    </>
  );
}
