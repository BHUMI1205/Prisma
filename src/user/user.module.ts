import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'prisma/prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET_KEY
    })
  ],
  controllers: [UserController],
  providers: [UserService, PrismaService, JwtService],
})
export class UserModule { }
