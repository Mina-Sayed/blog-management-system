import { Blog } from '../entities/blog.entity';

export interface BlogListResponse {
  data: Blog[];
  total: number;
}
