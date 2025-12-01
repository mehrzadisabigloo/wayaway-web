export interface CategoryItem {
    id : string ,
    cover ?: string ,
    active_children ?: CategoryItem[] ,
    title : string ,
    parent_id ?: string 
}