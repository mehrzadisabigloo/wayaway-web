export interface PostQueryParams {
    is_paginate?: boolean; // آیا نتایج صفحه‌بندی شود؟
    count_item?: number; // تعداد آیتم‌های هر صفحه
    status?: "Active" | "Inactive"; // وضعیت پست (فعال/غیرفعال)
    title?: string; // جستجو براساس عنوان پست
    user_id?: string; // جستجو براساس آی‌دی کاربر (UUID)
    filter?: "Oldest" | "Latest" | "Popular"; // فیلتر مرتب‌سازی (جدیدترین، قدیمی‌ترین، محبوب‌ترین)
    category_id?: string[]; // جستجو براساس آی‌دی دسته‌بندی (UUID)
  }
  