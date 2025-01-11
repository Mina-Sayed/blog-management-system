import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { User } from '../users/entities/user.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';
import { BlogListResponse } from './types/blog-list.response';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog)
    private blogsRepository: Repository<Blog>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createBlogDto: CreateBlogDto, user: User): Promise<Blog> {
    const blog = this.blogsRepository.create({
      ...createBlogDto,
      author: user,
    });
    const savedBlog = await this.blogsRepository.save(blog);
    await this.cacheManager.del('blogs_list');
    return savedBlog;
  }

  async findAll(
    page = 1,
    limit = 10,
    tags?: string[],
  ): Promise<BlogListResponse> {
    const cacheKey = `blogs_list_${page}_${limit}_${tags?.join('_')}`;
    const cachedData = await this.cacheManager.get<BlogListResponse>(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const queryBuilder = this.blogsRepository
      .createQueryBuilder('blog')
      .leftJoinAndSelect('blog.author', 'author')
      .orderBy('blog.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (tags?.length) {
      queryBuilder.where('blog.tags && :tags', { tags });
    }

    const [blogs, total] = await queryBuilder.getManyAndCount();
    const result: BlogListResponse = { data: blogs, total };

    await this.cacheManager.set(cacheKey, result, 60 * 5); // Cache for 5 minutes
    return result;
  }

  async findOne(id: string): Promise<Blog> {
    const cacheKey = `blog_${id}`;
    const cachedBlog = await this.cacheManager.get<Blog>(cacheKey);

    if (cachedBlog) {
      return cachedBlog;
    }

    const blog = await this.blogsRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    await this.cacheManager.set(cacheKey, blog, 60 * 5); // Cache for 5 minutes
    return blog;
  }

  async update(
    id: string,
    updateBlogDto: UpdateBlogDto,
    user: User,
  ): Promise<Blog> {
    const blog = await this.findOne(id);

    if (blog.author.id !== user.id) {
      throw new ForbiddenException('You can only update your own blogs');
    }

    Object.assign(blog, updateBlogDto);
    const updatedBlog = await this.blogsRepository.save(blog);

    await this.cacheManager.del(`blog_${id}`);
    await this.cacheManager.del('blogs_list');

    return updatedBlog;
  }

  async remove(id: string, user: User): Promise<void> {
    const blog = await this.findOne(id);

    if (blog.author.id !== user.id) {
      throw new ForbiddenException('You can only delete your own blogs');
    }

    await this.blogsRepository.remove(blog);
    await this.cacheManager.del(`blog_${id}`);
    await this.cacheManager.del('blogs_list');
  }
}
