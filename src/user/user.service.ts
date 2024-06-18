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
    const { name, email, password } = createUserDto;
    let hash = await bcrypt.hash(password, 10)
    let data = await this.prisma.users.create({
      data: {
        name,
        email,
        password: hash
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
    if (data) {
      let user = await bcrypt.compare(password, data[0].password)
      if (user) {
        let payload = { id: data[0].id, email: data[0].email }
        var token = await this.jwtService.sign(payload, { secret: process.env.SECRET_KEY });
        return {
          status: HttpStatus.CREATED,
          message: 'This action login a user',
          data: token
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

  async findAll() {
    let data = await this.prisma.users.findMany();
    return {
      status: HttpStatus.OK,
      message: 'This action returns all user',
      data: data
    }
  }

  async findOne(id: number) {
    let data = await this.prisma.users.findMany({
      where: {
        id: id
      },
    });
    return {
      status: HttpStatus.OK,
      message: `This action returns a #${id} user`,
      data: data
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
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

  async remove(id: number) {
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
