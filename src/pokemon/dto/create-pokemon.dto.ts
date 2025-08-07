import { IsInt, IsPositive, IsString, Min, MinLength, IsArray, IsOptional } from "class-validator";

export class CreatePokemonDto {
  @IsInt()
  @IsPositive()
  @Min(1)
  no: number;

  @IsString()
  @MinLength(1)
  name: string;

  @IsOptional()
  @IsInt()
  height?: number;

  @IsOptional()
  @IsInt()
  weight?: number;

  @IsOptional()
  @IsArray()
  types?: string[];

  @IsOptional()
  @IsArray()
  abilities?: string[];

  @IsOptional()
  @IsString()
  image?: string;
}
