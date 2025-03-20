import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Request } from 'express';
import { User } from '../user/entities/user.entity';
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createAddressDto: CreateAddressDto, @Req() req: Request) {
    return this.addressService.create({
      ...createAddressDto,
      user: req['user'] as User,
    });
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Req() req: Request) {
    const user = req['user'] as User;
    return this.addressService.findAll(user.id);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.addressService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
    @Req() req: Request,
  ) {
    return this.addressService.update(id, {
      ...updateAddressDto,
      user: req['user'] as User,
    });
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @Req() req: Request) {
    const user = req['user'] as User;
    return this.addressService.remove(id, user.id);
  }
}
