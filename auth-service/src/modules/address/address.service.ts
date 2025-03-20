import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  async create(createAddressDto: CreateAddressDto): Promise<Address> {
    const addresses = await this.findAll(createAddressDto.user.id);
    if (addresses.length >= 5)
      throw new BadRequestException(
        'Mỗi tài khoản chỉ được thêm tối đa 5 địa chỉ',
      );
    const address = this.addressRepository.create(createAddressDto);
    return this.addressRepository.save(address);
  }

  async findAll(id: string): Promise<Address[]> {
    return this.addressRepository.find({ where: { userId: id } });
  }

  async findOne(id: string): Promise<Address> {
    const address = await this.addressRepository.findOne({ where: { id } });
    if (!address) throw new BadRequestException('');
    return address;
  }

  async update(
    id: string,
    updateAddressDto: UpdateAddressDto,
  ): Promise<Address> {
    await this.addressRepository.update(
      { id: id, userId: updateAddressDto.user.id },
      updateAddressDto,
    );
    return this.findOne(id);
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.addressRepository.delete({
      id: id,
      userId: userId,
    });
  }
}
