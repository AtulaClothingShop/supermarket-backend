import { Type } from 'class-transformer';
import { IsEmail, IsString, IsNotEmpty, MinLength, IsObject, ValidateNested, IsOptional } from 'class-validator';

class AddressDto {
    @IsString()
    @IsOptional()
    public street: string;
   
    @IsString()
    @IsOptional()
    public city: string;
   
    @IsString()
    @IsOptional()
    public country: string;
}

export class UpdateUserDto {
    @IsObject()
    @ValidateNested()
    @Type(() => AddressDto)
    address: AddressDto;
}
 
export default UpdateUserDto;