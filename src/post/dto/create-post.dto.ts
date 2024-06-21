import { IsNotEmpty, IsString } from "class-validator"

export class CreatePostDto {
   
   @IsString()
   @IsNotEmpty()
   title: string

   @IsString()
   @IsNotEmpty()
   UserId: string

   @IsString()
   @IsNotEmpty()
   categoryId: string
}