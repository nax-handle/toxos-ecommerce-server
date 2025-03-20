import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Request } from 'express';
import { User } from '../user/entities/user.entity';
import { Roles } from 'src/common/decorators/role.decorator';
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  @Roles('user')
  create(@Body() createAddressDto: CreateAddressDto, @Req() req: Request) {
    return this.addressService.create({
      ...createAddressDto,
      user: req['user'] as User,
    });
  }

  @Get()
  @Roles('user')
  findAll(@Req() req: Request) {
    const user = req['user'] as User;
    return this.addressService.findAll(user.id);
  }

  @Get(':id')
  @Roles('user')
  findOne(@Param('id') id: string) {
    return this.addressService.findOne(id);
  }

  @Patch(':id')
  @Roles('user')
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
  @Roles('user')
  remove(@Param('id') id: string, @Req() req: Request) {
    const user = req['user'] as User;
    return this.addressService.remove(id, user.id);
  }
}
