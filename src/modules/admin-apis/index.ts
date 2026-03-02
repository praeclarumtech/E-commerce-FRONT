/**
 * Central export for admin panel API integrations.
 * Use these modules in admin routes and components.
 */

// Auth: POST /auth/login, POST /auth/refresh, GET /auth/me
export {
  signin,
  signup,
  refreshToken,
  getMe,
  resetPassword,
  forgotPassword,
  verifymail,
  verifyOTP,
  verifyRegistrationOTP,
  resendRegistrationOTP,
  updateUserData,
} from "../auth/api";

// Users: GET/POST/PUT/DELETE /users, POST /users/add, PUT /users/:id
export {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../users/api";

// Roles: GET/POST/PUT/DELETE /roles
export {
  getRoles,
  getRoleById,
  getAllRoles,
  createRole,
  updateRole,
  deleteRole,
  hardDeleteRole,
} from "../roles/api";

// Products: GET/POST/PUT/DELETE/PATCH /products, publish/unpublish, images
export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  patchProduct,
  deleteProduct,
  publishProduct,
  unpublishProduct,
  addProductImages,
  removeProductImage,
  setProductPrimaryImage,
} from "../products/api";

// Categories: GET/POST/PATCH/DELETE /categories (with subcategories)
export {
  getCategories,
  getCategoryById,
  getSubCategoryById,
  createCategory,
  addSubCategory,
  updateCategory,
  updateSubCategory,
  deleteCategory,
  deleteSubCategory,
  hardDeleteCategory,
  hardDeleteSubCategory,
} from "../categories/api";

// Variants: GET/POST/PATCH/DELETE /variants
export {
  getVariantsByProduct,
  getVariantById,
  createVariant,
  updateVariant,
  deleteVariant,
  hardDeleteVariant,
  addVariantImages,
  removeVariantImage,
  setVariantPrimaryImage,
} from "../variants/api";

// Inventory: GET /inventory/:variantId, reserve/release/deduct
export {
  getInventoryByVariant,
  reserveInventory,
  releaseInventory,
  deductInventory,
} from "../inventory/api";

// Orders: GET /orders, GET /orders/:orderId, PATCH /orders/:orderId
export {
  getOrders,
  getOrderById,
  updateOrder,
} from "../orders/api";

// Brands: GET/POST/PUT/DELETE /brands
export {
  getBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
} from "../brands/api";

// Offers: GET/POST/PUT/DELETE /offers
export {
  getOffers,
  getOfferById,
  createOffer,
  updateOffer,
  deleteOffer,
} from "../offers/api";

// Location: country, state, city
export {
  getCountries,
  getCountryById,
  createCountry,
  updateCountry,
  deleteCountry,
  getStates,
  getStateById,
  createState,
  updateState,
  deleteState,
  getCities,
  getCityById,
  createCity,
  updateCity,
  deleteCity,
} from "../location/api";

// Payments: GET /payments/user, GET /payments/:paymentId
export {
  getPaymentsByUser,
  getPaymentById,
} from "../payments/api";

// Services: GET/POST/PATCH/DELETE /services
export {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from "../services/api";
