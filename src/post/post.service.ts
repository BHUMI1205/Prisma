import { HttpStatus, Injectable } from '@nestjs/common';
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

  async findAll(req, createPostDto: CreatePostDto) {
    let token = (req.headers.authorization).split(' ')[1]
    let user = this.jwtService.decode(token)
    if (user) {
      let category = createPostDto.category
      let search = createPostDto.search
      let post = await this.prisma.post.findMany({
        where: {
          OR: [
            { Category: { name: category } },  //filter by category
            {
              OR: [  //serach by category/title/author name
                { title: { contains: search } },
                { author: { name: { contains: search } } },
                { Category: { name: { contains: search } } }
              ]
            }
          ]
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
              name: true,
            },
          }
        }
      });
      return {
        status: HttpStatus.OK,
        message: 'This action returns all post',
        data: post,
        count: post.length
      }
    } else {
      return {
        status: HttpStatus.UNAUTHORIZED,
        message: 'Please Login First',
      }
    }
  }

  async findOne(userId: string, createPostDto) {
    let category = createPostDto.category
    let search = createPostDto.search

    // const [data, count] = await this.prisma.$transaction([
    //   this.prisma.post.findMany({
    //     where: {
    //       AND: [
    //         {
    //           UserId: userId
    //         },
    //         {
    //           AND: [
    //             { Category: { name: category } },  //filter by category
    //             {
    //               OR: [  //serach by category/title/author name
    //                 { title: { contains: search } },
    //                 { author: { name: { contains: search } } },
    //                 { Category: { name: { contains: search } } }
    //               ]
    //             }
    //           ]
    //         }
    //       ],
    //     },
    //     select: {
    //       id: true,
    //       title: true,
    //       createdAt: true,
    //       updatedAt: true,
    //       author: {
    //         select: {
    //           id: true,
    //           name: true
    //         }
    //       },
    //       Category: {
    //         select: {
    //           id: true,
    //           name: true
    //         }
    //       }
    //     },
    //   }),
    //   this.prisma.post.count(),
    // ]);

    let data = await this.prisma.post.findMany({
      where: {
        AND: [
          {
            UserId: userId
          },
          {
            AND: [
              { Category: { name: category } },  //filter by category
              {
                OR: [  //serach by category/title/author name
                  { title: { contains: search } },
                  { author: { name: { contains: search } } },
                  { Category: { name: { contains: search } } }
                ]
              }
            ]
          }
        ],
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
      },
    });

    return {
      status: HttpStatus.OK,
      message: `This action returns user #${userId}'s post`,
      data: data,
      count: data.length
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