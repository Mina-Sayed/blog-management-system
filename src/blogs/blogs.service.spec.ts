import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BlogsService } from './blogs.service';
import { Blog } from './entities/blog.entity';
import { UserRole } from '../users/entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

describe('BlogsService', () => {
  let service: BlogsService;
  let repo: Repository<Blog>;

  const mockUser = {
    id: '1',
    username: 'testuser',
    role: UserRole.EDITOR,
  };

  const mockBlog = {
    id: '1',
    title: 'Test Blog',
    content: 'Test Content',
    tags: ['test'],
    author: mockUser,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogsService,
        {
          provide: getRepositoryToken(Blog),
          useValue: {
            create: jest.fn().mockReturnValue(mockBlog),
            save: jest.fn().mockResolvedValue(mockBlog),
            findOne: jest.fn().mockResolvedValue(mockBlog),
            createQueryBuilder: jest.fn(() => ({
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              skip: jest.fn().mockReturnThis(),
              take: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              getManyAndCount: jest.fn().mockResolvedValue([[mockBlog], 1]),
            })),
          },
        },
      ],
    }).compile();

    service = module.get<BlogsService>(BlogsService);
    repo = module.get<Repository<Blog>>(getRepositoryToken(Blog));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a blog post', async () => {
      const createBlogDto = {
        title: 'Test Blog',
        content: 'Test Content',
        tags: ['test'],
      };

      const result = await service.create(createBlogDto, {
        ...mockUser,
        email: 'test@example.com',
        password: 'password123',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      expect(result).toEqual(mockBlog);
    });
  });

  describe('findOne', () => {
    it('should find a blog post', async () => {
      const result = await service.findOne('1');
      expect(result).toEqual(mockBlog);
    });

    it('should throw NotFoundException if blog not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValueOnce(null);
      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });
});
