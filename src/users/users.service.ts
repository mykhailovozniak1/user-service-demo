import {
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { omit } from 'lodash';

import { UserRepository } from './user.repository';
import { AuthCredentialsDTO } from './dtos/auth-credentials.dto';
import { CreateUserDTO } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService
  ) {}

  public async getUserDetails(userId: string) {
    const user = await this.userRepository.findOne(
      { _id: userId },
      { _id: 1, username: 1, email: 1 }
    );

    if (!user) {
      throw new NotFoundException('UserEntity not found');
    }

    return user;
  }

  public async updateUser(id: string, updatePayload) {
    const updateUser = await this.userRepository.findOneAndUpdate(
      { _id: id },
      { $set: { username: updatePayload.username } },
      { _id: 1, username: 1, email: 1 }
    );

    if (!updateUser) {
      throw new NotFoundException('UserEntity not found');
    }

    return omit(updateUser.toObject(), ['password', '__v']);
  }

  public async deleteUser(id: string) {
    return this.userRepository.deleteOne({ _id: id });
  }

  public async getUsers() {
    const query = {};
    const projection = { username: 1, email: 1 };

    return this.userRepository.findAll(query, projection);
  }

  public async signUpUser(authCredentials: CreateUserDTO) {
    const { username, password, email } = authCredentials;

    const user = {
      username,
      password,
      email
    };

    return this.userRepository.create(user);
  }

  public async signInUser(authCredentials: AuthCredentialsDTO) {
    const { password, email } = authCredentials;
    const projection = {};
    const user = await this.userRepository.findOne({ email }, projection);

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { username: user.username, email, id: String(user._id) };
      const accessToken = await this.jwtService.sign(payload);

      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials!');
    }
  }
}
