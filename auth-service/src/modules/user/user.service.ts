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
  async create(createUser: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUser);
    await this.userRepository.save(user);
    return user;
  }
  async findUserById(id: string, msg: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: id, active: true },
    });
    if (!user) {
      throw new BadRequestException(msg);
    }
    return user;
  }
  async findUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email: email } });
  }
  async updateBalanceCashback(amount: number, id: string) {
    return await this.userRepository.increment(
      { id: id },
      'cashbackBalance',
      amount,
    );
  }
}
