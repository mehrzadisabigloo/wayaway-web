import { PostData } from "./post-retrieval-data";

export interface PostRetrievalResponse {
    success: boolean;
    message: string;
    data: PostData[];
  }