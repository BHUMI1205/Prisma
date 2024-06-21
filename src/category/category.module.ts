import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET_KEY
    })
  ],
  controllers: [CategoryController],
  providers: [CategoryService, PrismaService, JwtService],
})
export class CategoryModule { }
