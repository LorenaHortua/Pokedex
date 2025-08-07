import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Pokemon, PokemonSchema } from './entities/pokemon.entity';
import { HttpModule } from '@nestjs/axios'; 

@Module({
  controllers: [PokemonController],
  providers: [PokemonService],
  imports: [
    HttpModule, // ✅ Aquí lo agregas
    MongooseModule.forFeature([
      {
        name: Pokemon.name,
        schema: PokemonSchema,
      },
    ]),
  ],
})
export class PokemonModule {}

