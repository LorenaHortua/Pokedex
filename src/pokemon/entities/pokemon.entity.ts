import { Prop, Schema, SchemaFactory} from "@nestjs/mongoose"
import { Document } from  "mongoose"

@Schema()
export class Pokemon {
  @Prop({ required: true, unique: true })
  no: number;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  height: number;

  @Prop()
  weight: number;

  @Prop([String])
  types: string[];

  @Prop([String])
  abilities: string[];

  @Prop()
  image: string;
}

export const PokemonSchema = SchemaFactory.createForClass( Pokemon )
