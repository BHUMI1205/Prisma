import { IsEmail, IsNotEmpty, IsSemVer, IsString, IsStrongPassword } from 'class-validator'
export class CreateUserDto {

   @IsString()
   @IsNotEmpty()
   name: string

   @IsString()
   @IsEmail()
   email: string

   @IsString()
   password: string

   @IsString()
   role?: string
}