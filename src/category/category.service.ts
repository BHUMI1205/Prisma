import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CategoryService {

  constructor(private readonly prisma: PrismaService,
    private readonly jwtService : JwtService) { }

  async create(createCategoryDto: CreateCategoryDto, req) {
    const { name } = createCategoryDto

    let token = (req.headers.authorization).split(' ')[1]
    let user;
    user = this.jwtService.decode(token)
    let role = user.role
    if (role == 'ADMIN') {
      let data = await this.prisma.category.create({
        data: {
          name
        }
      })
      return {
        status: HttpStatus.CREATED,
        message: 'This action adds a new category',
        data: data
      }
    } else {
      return {
        status: HttpStatus.UNAUTHORIZED,
        message: 'Only ADMIN can add category',
      }
    }
  }

  async findAll() {
    let category = await this.prisma.category.findMany({
      skip: 3,
      take: 3
    });
    return {
      status: HttpStatus.OK,
      message: 'This action returns all category',
      data: category
    }
  }

  async findOne(id: string) {
    let data = await this.prisma.category.findUnique({
      where: { id: id },
    });
    return {
      status: HttpStatus.OK,
      message: `This action returns a #${id} category`,
      data: data
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const { name } = updateCategoryDto
    let data = await this.prisma.category.update({
      where: {
        id: id
      },
      data: {
        name,
      }
    });
    return {
      status: HttpStatus.OK,
      message: `This action updates a #${id} category`,
      data: data
    }
  }

  async remove(id: string) {
    await this.prisma.category.delete({
      where: {
        id: id
      },
    });
    return {
      status: HttpStatus.OK,
      message: `This action removes a #${id} category`
    }
  }
}
