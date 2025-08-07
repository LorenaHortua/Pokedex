import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios'; // ⬅ Import para llamar a la PokéAPI

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();

    console.log('DTO recibido:', createPokemonDto);

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      console.log('Guardado en Mongo:', pokemon);
      return pokemon;
    } catch (error) {
      if (error.code === 11000) {
        console.error('Error 11000 (duplicado):', error.keyValue);
        throw new BadRequestException(
          `El Pokémon ya existe en la base de datos: ${JSON.stringify(
            error.keyValue,
          )}`,
        );
      }
      console.error('Error inesperado al guardar:', error);
      throw new InternalServerErrorException(
        `No se puede crear un Pokémon - revise el log`,
      );
    }
  }

  async findAll(): Promise<Pokemon[]> {
    try {
      return await this.pokemonModel.find().sort({ no: 1 });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'No se pudieron obtener los Pokémon',
      );
    }
  }

  async findByName(name: string) {
  name = name.toLowerCase();
  let pokemon = await this.pokemonModel.findOne({ name });

  if (!pokemon) {
    // Buscar en la PokéAPI
    try {
      const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);

      // Crear el nuevo Pokémon en la BD con más datos
      const newPokemon = await this.create({
        no: data.id,
        name: data.name,
        height: data.height,
        weight: data.weight,
        types: data.types.map((t: any) => t.type.name),
        abilities: data.abilities.map((a: any) => a.ability.name),
        image: data.sprites.front_default
      });

      return newPokemon;
    } catch (error) {
      throw new NotFoundException(
        `El Pokémon con nombre ${name} no existe en PokéAPI ni en tu base de datos`
      );
    }
  }

  return pokemon;
}

  async findOne(id: string) {
    let pokemon;

    try {
      pokemon = await this.pokemonModel.findById(id);

      if (!pokemon) {
        throw new NotFoundException(
          `No se encontró un Pokémon con el id: ${id}`,
        );
      }

      return pokemon;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new BadRequestException(`El id '${id}' no es válido`);
      }

      console.error(error);
      throw new InternalServerErrorException(
        `No se pudo obtener el Pokémon - revise el log`,
      );
    }
  }

  async update(
    id: string,
    updatePokemonDto: UpdatePokemonDto,
  ): Promise<Pokemon> {
    try {
      const pokemon = await this.findOne(id);

      if (updatePokemonDto.name) {
        updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
      }

      await pokemon.updateOne(updatePokemonDto);

      return { ...pokemon.toObject(), ...updatePokemonDto };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Error al actualizar el Pokémon',
      );
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.pokemonModel.findByIdAndDelete(id);

    if (!result) {
      throw new NotFoundException(
        `No se encontró un Pokémon con el id: ${id}`,
      );
    }

    return { message: `Pokémon eliminado correctamente (id: ${id})` };
  }
}