import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async checkExistsAndThrow(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      throw new BadRequestException('User already exists');
    }
  }
  create(createUser: CreateUserDto) {
    return this.userRepository.save(createUser);
  }
  async findUserById(id: number, msg: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: id, active: true },
    });
    if (!user) {
      throw new BadRequestException(msg);
    }
    return user;
  }
}
