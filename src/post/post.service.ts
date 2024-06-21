import { HttpStatus, Injectable, Post } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService,
    private readonly jwtService: JwtService) { }

  async create(createPostDto: CreatePostDto) {
    const { title, UserId, categoryId, } = createPostDto;
    let data = await this.prisma.post.create({
      data: {
        title, UserId, categoryId
      },
    })
    return {
      status: HttpStatus.CREATED,
      message: 'This action adds a new post',
      data: data
    }
  }

  async findAll(req) {
    let token = (req.headers.authorization).split(' ')[1]
    let user = this.jwtService.decode(token)
    let role = user.role
    if (role == 'ADMIN') {
      let post = await this.prisma.post.findMany({
        select: {
          id: true,
          title: true,
          createdAt: true,
          updatedAt: true,
          author: {
            select: {
              id: true,
              name: true
            }
          },
          Category: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });
      return {
        status: HttpStatus.OK,
        message: 'This action returns all post',
        data: post
      }
    } else {
      let post = await this.prisma.post.findMany({
        where: {
          id: user.id
        },
        select: {
          id: true,
          title: true,
          createdAt: true,
          updatedAt: true,
          author: {
            select: {
              id: true,
              name: true
            }
          },
          Category: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });
      return {
        status: HttpStatus.OK,
        message: 'This action returns all post',
        data: post
      }
    }
  }

  async findOne(id: string) {
    let data = await this.prisma.post.findUnique({
      where: { id: id },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            name: true
          }
        },
        Category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    return {
      status: HttpStatus.OK,
      message: `This action returns a #${id} post`,
      data: data
    }
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    const { title, UserId, categoryId } = updatePostDto
    let data = await this.prisma.post.update({
      where: {
        id: id
      },
      data: {
        title, UserId, categoryId
      }
    });
    return {
      status: HttpStatus.OK,
      message: `This action updates a #${id} post`,
      data: data
    }
  }

  async remove(id: string) {
    await this.prisma.post.delete({
      where: {
        id: id
      },
    });
    return {
      status: HttpStatus.OK,
      message: `This action removes a #${id} post`
    }
  }

}