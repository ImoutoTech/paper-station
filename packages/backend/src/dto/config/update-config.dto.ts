import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateConfigDto {
  @IsString()
  @IsNotEmpty()
  data: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
