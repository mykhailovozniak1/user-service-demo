import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDTO } from './dtos/create-user.dto';
import {
  ConflictException,
  InternalServerErrorException
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  public async deleteOne(query) {
    return this.userModel.deleteOne(query);
  }

  public async findOneAndUpdate(query, update, projection) {
    return this.userModel.findOneAndUpdate(query, update, projection);
  }

  public async findAll(query: any, projection: any) {
    return this.userModel.find(query, projection).exec();
  }

  public async findOne(query, projection) {
    return this.userModel.findOne(query, projection);
  }

  public async create(user: CreateUserDTO) {
    const { username, email, password } = user;
    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      const createdUser = new this.userModel({
        username,
        email,
        password: hashedPassword
      });

      await createdUser.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('UserEntity already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  public async insertMany(users: any) {
    return this.userModel.insertMany(users);
  }
}
