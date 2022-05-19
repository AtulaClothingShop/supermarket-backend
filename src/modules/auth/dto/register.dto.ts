import { IsEmail, IsString, IsNotEmpty, MinLength, IsArray, IsEnum } from 'class-validator';
import { Roles } from 'src/entities/role.entity';
 
export class RegisterDto {
  @IsEmail()
  email: string;
 
  @IsString()
  @IsNotEmpty()
  name: string;
 
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsArray()
  @IsEnum(Roles, { each: true })
  roles: string[];
}
 
export default RegisterDto;