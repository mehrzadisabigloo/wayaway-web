export interface PostRetrievalBody {
    is_paginate?: boolean;
    count_item?: number;
    status?: "active" | "inactive";
    title?: string;
    user_id?: string;
    filter?: "oldest" | "latest" | "popular";
    category_id?: string;
  }
  