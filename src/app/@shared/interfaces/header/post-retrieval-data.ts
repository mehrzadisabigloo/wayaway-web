export interface PostData {
    id: string;
    category_id: string;
    title: string;
    title_url: string;
    key_words: string[];
    description: string;
    reading_duration: string;
    destination: string;
    thumbnail: string | null;
    created_at: string;
  }