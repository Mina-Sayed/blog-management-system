import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/entities/user.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Repository } from 'typeorm';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogsRepository: Repository<Blog>,
  ) {}

  async create(createBlogDto: CreateBlogDto, user: User): Promise<Blog> {
    const blog = this.blogsRepository.create({
      ...createBlogDto,
      author: user,
    });
    return this.blogsRepository.save(blog);
  }

  async findAll(
    page = 1,
    limit = 10,
    tags?: string[],
  ): Promise<{ data: Blog[]; total: number }> {
    const queryBuilder = this.blogsRepository
      .createQueryBuilder('blog')
      .leftJoinAndSelect('blog.author', 'author')
      .orderBy('blog.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (tags?.length) {
      queryBuilder.where('blog.tags @> ARRAY[:...tags]', { tags });
    }

    const [blogs, total] = await queryBuilder.getManyAndCount();
    return { data: blogs as Blog[], total };
  }

  async findOne(id: string): Promise<Blog> {
    const blog = await this.blogsRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    return blog;
  }

  async update(
    id: string,
    updateBlogDto: UpdateBlogDto,
    user: User,
  ): Promise<Blog> {
    const blog = await this.findOne(id);

    if (blog.author.id !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only update your own blogs');
    }

    await this.blogsRepository.update(id, updateBlogDto);
    return this.findOne(id);
  }

  async remove(id: string, user: User): Promise<void> {
    await this.findOne(id);

    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can delete blogs');
    }

    await this.blogsRepository.delete(id);
  }
}
