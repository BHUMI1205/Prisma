import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';

@Module({ 
  imports: [
    JwtModule.register({
      secret: process.env.SECRET_KEY
    })
  ],
  controllers: [PostController],
  providers: [PostService , PrismaService , JwtService],
})
export class PostModule { }
