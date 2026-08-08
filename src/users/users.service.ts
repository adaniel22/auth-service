import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    await this.userRepository.getEntityManager().persist(user).flush();
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findOne(id: string): Promise<User | null> {
    return this.userRepository.findOne({ id });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ email });
  }

  async update(
    id: string,
    data: Partial<{ email: string; password: string }>,
  ): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    this.userRepository.assign(user, data);
    await this.userRepository.getEntityManager().persist(user).flush();
    return user;
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepository.getEntityManager().remove(user).flush();
  }

  async changePassword(
    id: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const matches = await bcrypt.compare(oldPassword, user.password);
    if (!matches) {
      throw new UnauthorizedException('Invalid password');
    }
    user.password = await bcrypt.hash(newPassword, 12);
    await this.userRepository.getEntityManager().persist(user).flush();
  }

  async setRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const user = await this.userRepository.findOne({ id: userId });
    if (!user) {
      throw new NotFoundException('A felhasználó nem található');
    }
    user.refreshTokenHash = await bcrypt.hash(refreshToken, 12);
    await this.userRepository.getEntityManager().flush();
  }
}
