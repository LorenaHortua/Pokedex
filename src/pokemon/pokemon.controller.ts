import { Controller, Get, Post, Body, Patch, Param, Delete,  HttpCode, HttpStatus, NotFoundException } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { HttpService } from '@nestjs/axios'; 
import { firstValueFrom } from 'rxjs'; 

@Controller('pokemon')
export class PokemonController {
  constructor(
    private readonly pokemonService: PokemonService,
    private readonly httpService: HttpService 
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  create(@Body() createPokemonDto: CreatePokemonDto) {
    return this.pokemonService.create(createPokemonDto);
  }

  @Get()
  findAll() {
    return this.pokemonService.findAll();
  }

  @Get('name/:name')
findByName(@Param('name') name: string) {
  return this.pokemonService.findByName(name);
}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pokemonService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePokemonDto: UpdatePokemonDto) {
    return this.pokemonService.update(id, updatePokemonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pokemonService.remove(id);
  }

  @Post('register/:name')
  async registerPokemon(@Param('name') name: string) {
    const existing = await this.pokemonService.findByName(name);
    if (existing) return existing;

    try {
      const response = await firstValueFrom(
        this.httpService.get(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`)
      );

      const data = response.data;

      const createPokemonDto: CreatePokemonDto = {
        no: data.id,
        name: data.name,
        image: data.sprites.front_default,
      };

      return await this.pokemonService.create(createPokemonDto);
    } catch (error) {
      throw new NotFoundException(`No se pudo encontrar el Pokémon "${name}" en PokéAPI`);
    }
  }
}