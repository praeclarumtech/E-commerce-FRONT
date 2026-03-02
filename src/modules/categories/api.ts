import api from "../../shared/api";
import { PaginationParams } from "../../shared/types";
import { 
    Category, 
    CreateCategoryParams, 
    UpdateCategoryParams,
    SubCategoryFormValues 
} from "./type";

// Get all categories with pagination
export function getCategories({ params }: { params: PaginationParams }) {
    return api.get('/categories', { params });
}

// Get single category
export function getCategoryById(categoryId: string) {
    return api.get<{ data: Category }>(`/categories/${categoryId}`);
}

// Get subcategory
export function getSubCategoryById({ params }: { params: PaginationParams }) {
    return api.get('/categories',{ params });
}

// Create category (with optional subcategories)
export function createCategory(data: CreateCategoryParams) {
    const formData = new FormData();
    
    formData.append('name', data.name);
    
    if (data.description) {
        formData.append('description', data.description);
    }
    
    if (data.image) {
        formData.append('image', data.image);
    }
    
    // Subcategories - send each field individually with array notation
    if (data.subCategories && data.subCategories.length > 0) {
        data.subCategories.forEach((sub, index) => {
            formData.append(`subCategories[${index}][name]`, sub.name);
            if (sub.description) {
                formData.append(`subCategories[${index}][description]`, sub.description);
            }
        });
    }
    
    // Subcategory images (order matters - matches subCategories array order)
    if (data.subImages && data.subImages.length > 0) {
        data.subImages.forEach((file) => {
            formData.append('subImages', file);
        });
    }

    return api.post('/categories', formData);
}

// Add subcategory to existing category
export function addSubCategory({ 
    categoryId, 
    data, 
    image 
}: { 
    categoryId: string; 
    data: SubCategoryFormValues; 
    image?: File;
}) {
    const formData = new FormData();
    
    formData.append('name', data.name);
    
    if (data.description) {
        formData.append('description', data.description);
    }
    
    if (image) {
        formData.append('image', image);
    }

    return api.post(`/categories/${categoryId}`, formData);
}

// Update category
export function updateCategory({ 
    categoryId, 
    data 
}: { 
    categoryId: string; 
    data: UpdateCategoryParams;
}) {
    const formData = new FormData();
    
    if (data.name) {
        formData.append('name', data.name);
    }
    if (data.description !== undefined) {
        formData.append('description', data.description);
    }
    if (data.isActive !== undefined) {
        formData.append('isActive', data.isActive.toString());
    }
    if (data.image) {
        formData.append('image', data.image);
    }

    return api.patch(`/categories/${categoryId}`, formData);
}

// Update subcategory
export function updateSubCategory({ 
    categoryId, 
    subCategoryId, 
    data,
    image
}: { 
    categoryId: string; 
    subCategoryId: string;
    data: UpdateCategoryParams;
    image?: File;
}) {
    const formData = new FormData();
    
    if (data.name) {
        formData.append('name', data.name);
    }
    if (data.description !== undefined) {
        formData.append('description', data.description);
    }
    if (data.isActive !== undefined) {
        formData.append('isActive', String(data.isActive));
    }
    if (image) {
        formData.append('image', image);
    }

    return api.patch(`/categories/${categoryId}/${subCategoryId}`, formData);
}

// Soft delete category
export function deleteCategory(categoryId: string) {
    return api.delete(`/categories/${categoryId}`);
}

// Soft delete subcategory
export function deleteSubCategory(categoryId: string, subCategoryId: string) {
    return api.delete(`/categories/${categoryId}/${subCategoryId}`);
}

// Hard delete category
export function hardDeleteCategory(categoryId: string) {
    return api.delete(`/categories/hard/${categoryId}`);
}

// Hard delete subcategory
export function hardDeleteSubCategory(categoryId: string, subCategoryId: string) {
    return api.delete(`/categories/hard/${categoryId}/${subCategoryId}`);
}
