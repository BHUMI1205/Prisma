import { from } from "rxjs"

import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator'
export class CreateUserDto {

   @IsString()
   @IsNotEmpty()
   name: string

   @IsString()
   @IsEmail()
   email: string

   @IsString()
   password: string
}
 