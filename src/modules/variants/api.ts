import api from "../../shared/api";
import type { PaginationParams } from "../../shared/interface";

/** Minimal variants API for offer form target options */
export function getVariants({ params }: { params?: PaginationParams }) {
  return api.get("/variants", { params });
}
