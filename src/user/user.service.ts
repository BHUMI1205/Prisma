import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt'
import * as dotenv from 'dotenv';
dotenv.config()

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService,
    private readonly jwtService: JwtService) { }

  async create(createUserDto: CreateUserDto) {
    const { name, email, password, role } = createUserDto;
    let hash = await bcrypt.hash(password, 10)
    let data = await this.prisma.users.create({
      data: {
        name,
        email,
        password: hash
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    })
    return {
      status: HttpStatus.CREATED,
      message: 'This action adds a new user',
      data: data
    }
  }

  async login(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    let data = await this.prisma.users.findMany({
      where: {
        email: email
      }
    })
    if (data.length == 1) {
      let user = await bcrypt.compare(password, data[0].password)
      if (user) {
        let payload = { id: data[0].id, email: data[0].email, role: data[0].role }
        var token = await this.jwtService.sign(payload, { secret: process.env.SECRET_KEY });
        return {
          status: HttpStatus.CREATED,
          message: 'This action login a user',
          token: token
        }
      } else {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'password is wrong',
        }
      }
    } else {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'email is wrong',
      }
    }

  }

  async findAll(req) {
    let token = (req.headers.authorization).split(' ')[1]
    let user;
    user = this.jwtService.decode(token)
    let role = user.role
    if (role == 'ADMIN') {
      let user = await this.prisma.users.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true
        },
        orderBy: {
          name: 'desc'
        },
        where: {
          email: {
            // startsWith: 'user'
            // endsWith:'gmail.com',
            contains: 'gmail'
          }
        },
        skip: 1,
        take: 2
      });
      return {
        status: HttpStatus.OK,
        message: 'This action returns user',
        data: user
      }
    } else {
      return {
        status: HttpStatus.OK,
        message: 'This action returns user',
        data: user
      }
    }
  }

  async findOne(id: string) {
    let data = await this.prisma.users.findUnique({
      where: { id: id },
    });
    return {
      status: HttpStatus.OK,
      message: `This action returns a #${id} user`,
      data: data
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { name, email } = updateUserDto
    let data = await this.prisma.users.update({
      where: {
        id: id
      },
      data: {
        name,
        email
      }
    });
    return {
      status: HttpStatus.OK,
      message: `This action updates a #${id} user`,
      data: data
    }
  }

  async remove(id: string) {
    await this.prisma.users.delete({
      where: {
        id: id
      },
    });
    return {
      status: HttpStatus.OK,
      message: `This action removes a #${id} user`
    }
  }
}
