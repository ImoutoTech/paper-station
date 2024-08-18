import { IsNotEmpty, IsString } from 'class-validator';

export class CreateConfigDto {
  @IsString()
  @IsNotEmpty()
  data: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
