import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { JwtAuthGuard } from 'src/auth/jwt.guards';
import { CreateCardsDto, TUpdateCardsDto } from './dto/cards.dto';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createCards(@Req() @Body() createCardsDto: CreateCardsDto) {
    return this.cardsService.createCards(createCardsDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.cardsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: number) {
    return this.cardsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async patchCards(
    @Param('id') id: number,
    @Body() updateCardsDto: TUpdateCardsDto,
  ) {
    return this.cardsService.patchCards(id, updateCardsDto);
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard)
  async deleteCard(id: number) {
    return this.cardsService.deleteCard(id);
  }

  @Delete('delete')
  @UseGuards(JwtAuthGuard)
  async deleteCards() {
    return this.cardsService.deleteAllCards();
  }
}
