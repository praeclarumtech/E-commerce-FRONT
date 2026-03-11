import { mdiClose } from "@mdi/js";
import moment from "moment";
import Button from "../../_components/Button";
import OverlayLayer from "../../_components/OverlayLayer";
import CardBox from "../../_components/CardBox";
import type { Order } from "../interface";

type OrderViewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
};

export default function OrderViewModal({ isOpen, onClose, order }: OrderViewModalProps) {
  if (!isOpen || !order) return null;

  const orderId = (order.orderId as string) || order._id?.slice(-8) || "—";
  const status = order.status as string | undefined;
  const createdAt = order.createdAt as string | undefined;
  const updatedAt = order.updatedAt as string | undefined;

  return (
    <OverlayLayer onClick={onClose} className="cursor-pointer">
      <CardBox
        className="z-50 w-11/12 max-w-2xl animate-fade-in shadow-lg md:w-3/5"
        isModal
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-200 pb-3 dark:border-slate-700">
          <h2 className="text-lg font-semibold">Order {orderId}</h2>
          <Button icon={mdiClose} color="whiteDark" onClick={onClose} small roundedFull />
        </div>
        <div className="space-y-4 py-4">
          {status && (
            <div>
              <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800 capitalize dark:bg-blue-900/30 dark:text-blue-400">
                {status}
              </span>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            {createdAt && (
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-slate-400">Created At</p>
                <p className="mt-1 text-sm text-gray-900 dark:text-slate-200">
                  {moment(createdAt).format("DD MMM YYYY, hh:mm A")}
                </p>
              </div>
            )}
            {updatedAt && (
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-slate-400">Updated At</p>
                <p className="mt-1 text-sm text-gray-900 dark:text-slate-200">
                  {moment(updatedAt).format("DD MMM YYYY, hh:mm A")}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end border-t border-gray-200 pt-3 dark:border-slate-700">
          <Button label="Close" color="whiteDark" outline onClick={onClose} />
        </div>
      </CardBox>
    </OverlayLayer>
  );
}
