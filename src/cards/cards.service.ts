import { eq } from 'drizzle-orm';
import * as schema from '../schema';
import { Inject, Injectable } from '@nestjs/common';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { CreateCardsDto, TUpdateCardsDto } from './dto/cards.dto';

@Injectable()
export class CardsService {
  constructor(
    @Inject('DB_TRELLO') private drizzleTrello: MySql2Database<typeof schema>,
  ) {}

  async findAll() {
    const cards = await this.drizzleTrello.query.Cards.findMany();
    return {
      cards,
    };
  }

  async findOne(id: number) {
    const card = await this.drizzleTrello
      .select()
      .from(schema.Cards)
      .where(eq(schema.Cards.cards_id, id));
    return {
      card,
    };
  }

  async createCards(createCardsDto: CreateCardsDto) {
    const [new_card] = await this.drizzleTrello.insert(schema.Cards).values({
      cards_name: createCardsDto.cards_name,
      createAt: createCardsDto.createAt,
    });

    const newCardID = new_card.insertId;
    const [NewCards] = await this.drizzleTrello
      .select()
      .from(schema.Cards)
      .where(eq(schema.Cards.cards_id, newCardID))
      .limit(1);
    return {
      NewCards,
    };
  }

  async patchCards(id: number, updateCardDto: TUpdateCardsDto) {
    if (id == null || isNaN(id)) {
      throw new Error('Invalid card id');
    }

    if (updateCardDto.cards_name) {
      updateCardDto.cards_name = updateCardDto.cards_name;
    }

    if (updateCardDto.createAt) {
      updateCardDto.createAt = updateCardDto.createAt;
    }

    const [update] = await this.drizzleTrello
      .update(schema.Cards)
      .set(updateCardDto)
      .where(eq(schema.Cards.cards_id, id));
    return {
      update,
    };
  }

  async deleteCard(id: number) {
    const [deleteCard] = await this.drizzleTrello
      .delete(schema.Cards)
      .where(eq(schema.Cards.cards_id, id));
    return {
      deleteCard,
    };
  }

  async deleteAllCards() {
    const [deleteCards] = await this.drizzleTrello.delete(schema.Cards);
    return {
      deleteCards,
    };
  }
}
