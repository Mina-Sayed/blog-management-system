import { IsString, IsArray, IsOptional, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateBlogDto {
  @ApiPropertyOptional({ example: 'Updated Blog Title' })
  @IsString()
  @IsOptional()
  @MinLength(3)
  title?: string;

  @ApiPropertyOptional({ example: 'Updated blog content...' })
  @IsString()
  @IsOptional()
  @MinLength(10)
  content?: string;

  @ApiPropertyOptional({ example: ['technology', 'programming'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
