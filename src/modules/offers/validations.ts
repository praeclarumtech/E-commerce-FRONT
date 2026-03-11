import { array, boolean, object, string } from "yup";
import { ENUM_OFFER_TYPE, ENUM_OFFER_TARGET } from "./constants";

const offerTypeValues = Object.values(ENUM_OFFER_TYPE) as string[];
const offerTargetValues = Object.values(ENUM_OFFER_TARGET) as string[];

export const offerSchema = object().shape({
  name: string()
    .min(2, "Offer name must be at least 2 characters")
    .max(200, "Offer name is too long")
    .required("Please enter offer name."),
  code: string().max(50, "Code is too long").optional(),
  description: string().max(500, "Description is too long").optional(),
  type: string()
    .oneOf(offerTypeValues, "Invalid offer type")
    .required("Please select offer type."),
  value: string()
    .required("Please enter offer value.")
    .test("min", "Value must be 0 or more", (v) => v === "" || Number(v) >= 0),
  minOrderValue: string()
    .optional()
    .test("min", "Min order value must be 0 or more", (v) => !v || Number(v) >= 0),
  startDate: string().optional(),
  endDate: string().optional(),
  targetType: string()
    .oneOf(offerTargetValues, "Invalid target type")
    .required("Please select target type."),
  targetIds: array()
    .of(string().required())
    .optional()
    .when("targetType", {
      is: (v: string) =>
        v === ENUM_OFFER_TARGET.PRODUCT ||
        v === ENUM_OFFER_TARGET.CATEGORY ||
        v === ENUM_OFFER_TARGET.VARIANT,
      then: (schema) =>
        schema.required("Select at least one target.").min(1, "Select at least one product/category/variant."),
    }),
  isStackable: boolean().optional(),
  usageLimit: string().optional().test("min", "Must be at least 1", (v) => !v || Number(v) >= 1),
  usageLimitPerUser: string().optional().test("min", "Must be at least 1", (v) => !v || Number(v) >= 1),
  isActive: boolean().optional(),
});
