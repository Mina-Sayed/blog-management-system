import { ApiProperty } from '@nestjs/swagger';
import { Blog } from '../entities/blog.entity';

export class BlogListResponse {
  @ApiProperty({ type: [Blog] })
  data: Blog[];

  @ApiProperty()
  total: number;
}
