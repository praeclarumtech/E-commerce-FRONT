import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { Package, Search, Minus, Plus, RotateCcw } from "lucide-react";

import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Button from "../../../components/ui/button/Button";
import { getInventoryByVariant, reserveInventory, releaseInventory, deductInventory } from "../api";
import { InventoryRecord } from "../type";

function Inventory() {
    const queryClient = useQueryClient();
    const [variantId, setVariantId] = useState("");
    const [reserveQty, setReserveQty] = useState("");
    const [releaseQty, setReleaseQty] = useState("");
    const [deductQty, setDeductQty] = useState("");

    const {
        data: inventory,
        isLoading,
        isFetching,
        refetch,
        isSuccess,
    } = useQuery({
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
        <div className="h-full">
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">Inventory</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        View inventory by variant and use reserve, release, or deduct.
                    </p>
                </div>

                {/* Variant ID lookup */}
                <div className="mb-6">
                    <Label>Variant ID</Label>
                    <div className="mt-1.5 flex gap-2">
                        <Input
                            placeholder="Enter variant ID"
                            value={variantId}
                            onChange={(e) => setVariantId(e.target.value)}
                            className="flex-1"
                        />
                    </div>
                </div>

                {/* Loaded inventory details */}
                {variantId.trim() && (
                    <>
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500" />
                            </div>
                        ) : isSuccess && record ? (
                            <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <Package className="h-5 w-5 text-brand-600" />
                                    <span className="font-medium text-gray-900">Inventory for variant</span>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase">Variant ID</p>
                                        <p className="mt-1 text-gray-900 font-mono text-sm truncate" title={record.variantId as string}>
                                            {record.variantId ?? "—"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase">Quantity</p>
                                        <p className="mt-1 text-lg font-semibold text-gray-900">
                                            {record.quantity ?? 0}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase">Reserved</p>
                                        <p className="mt-1 text-lg font-semibold text-amber-700">
                                            {record.reserved ?? 0}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase">Available</p>
                                        <p className="mt-1 text-lg font-semibold text-green-700">
                                            {record.available ?? (Number(record.quantity ?? 0) - Number(record.reserved ?? 0))}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="mb-6 rounded-lg border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
                                <Search className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-500">No inventory found for this variant.</p>
                            </div>
                        )}

                        {/* Reserve / Release / Deduct */}
                        {isSuccess && record && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="rounded-lg border border-gray-200 p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Plus className="h-4 w-4 text-blue-600" />
                                        <span className="font-medium text-gray-900">Reserve</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-2">Hold quantity for an order.</p>
                                    <div className="flex gap-2">
                                        <Input
                                            type="number"
                                            min={1}
                                            placeholder="Qty"
                                            value={reserveQty}
                                            onChange={(e) => setReserveQty(e.target.value)}
                                            className="w-24"
                                        />
                                        <Button
                                            size="sm"
                                            disabled={!reserveQty || reserveMutation.isPending}
                                            onClick={() => reserveMutation.mutate()}
                                        >
                                            {reserveMutation.isPending ? "..." : "Reserve"}
                                        </Button>
                                    </div>
                                </div>

                                <div className="rounded-lg border border-gray-200 p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <RotateCcw className="h-4 w-4 text-amber-600" />
                                        <span className="font-medium text-gray-900">Release</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-2">Return reserved quantity.</p>
                                    <div className="flex gap-2">
                                        <Input
                                            type="number"
                                            min={1}
                                            placeholder="Qty"
                                            value={releaseQty}
                                            onChange={(e) => setReleaseQty(e.target.value)}
                                            className="w-24"
                                        />
                                        <Button
                                            size="sm"
                                            disabled={!releaseQty || releaseMutation.isPending}
                                            onClick={() => releaseMutation.mutate()}
                                        >
                                            {releaseMutation.isPending ? "..." : "Release"}
                                        </Button>
                                    </div>
                                </div>

                                <div className="rounded-lg border border-gray-200 p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Minus className="h-4 w-4 text-red-600" />
                                        <span className="font-medium text-gray-900">Deduct</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-2">Reduce stock (e.g. after sale).</p>
                                    <div className="flex gap-2">
                                        <Input
                                            type="number"
                                            min={1}
                                            placeholder="Qty"
                                            value={deductQty}
                                            onChange={(e) => setDeductQty(e.target.value)}
                                            className="w-24"
                                        />
                                        <Button
                                            size="sm"
                                            disabled={!deductQty || deductMutation.isPending}
                                            onClick={() => deductMutation.mutate()}
                                        >
                                            {deductMutation.isPending ? "..." : "Deduct"}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {!variantId.trim() && (
                    <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
                        <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm text-gray-500">Enter a variant ID above to view and manage inventory.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Inventory;
