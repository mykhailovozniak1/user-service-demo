import { JwtService } from '@nestjs/jwt';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';

import { UsersService } from '../users.service';
import { UserRepository } from '../user.repository';

const userRepositoryMock = {
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn(),
  deleteOne: jest.fn(),
  findAll: jest.fn(),
  create: jest.fn()
};
const jwtServiceMock = {
  sign: jest.fn()
};

describe('User service test', () => {
  beforeEach(() => {
    userRepositoryMock.findOne.mockClear();
    userRepositoryMock.findOneAndUpdate.mockClear();
    userRepositoryMock.deleteOne.mockClear();
    userRepositoryMock.findAll.mockClear();
    userRepositoryMock.create.mockClear();
    jwtServiceMock.sign.mockClear();
  });

  const userService = new UsersService(
    userRepositoryMock as unknown as UserRepository,
    jwtServiceMock as unknown as JwtService
  );

  test('should successfully get user details', async () => {
    const userId = '61571de17f2b3f2d204b5268';
    const userDetailsMock = {
      id: userId,
      username: 'bob',
      email: 'bob@email.com'
    };
    const projection = { _id: 1, username: 1, email: 1 };
    userRepositoryMock.findOne.mockResolvedValue(userDetailsMock);
    const userDetails = await userService.getUserDetails(userId);

    expect(userDetails).toEqual(userDetailsMock);
    expect(userRepositoryMock.findOne).toHaveBeenNthCalledWith(
      1,
      { _id: userId },
      projection
    );
  });

  test('should throw not found error because user not found by id', async () => {
    const userId = '61571de17f2b3f2d204b5262';
    const projection = { _id: 1, username: 1, email: 1 };
    userRepositoryMock.findOne.mockResolvedValue(null);

    try {
      await userService.getUserDetails(userId);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
    }

    expect(userRepositoryMock.findOne).toHaveBeenNthCalledWith(
      1,
      { _id: userId },
      projection
    );
  });

  test('should successfully update user name', async () => {
    const userId = '61571de17f2b3f2d204b5268';
    const username = 'bob2';
    const userDetailsMock = {
      username,
      id: userId,
      email: 'bob@email.com'
    };
    const userDetailsDBMock = {
      __proto__: userDetailsMock,
      toObject() {
        return {
          username: this.username,
          id: this.id,
          email: this.email
        };
      }
    };
    const updatePayload = { username };
    const projection = { _id: 1, username: 1, email: 1 };
    userRepositoryMock.findOneAndUpdate.mockResolvedValue(userDetailsDBMock);

    const userDetails = await userService.updateUser(userId, updatePayload);
    expect(userDetails).toEqual(userDetailsMock);
    expect(userRepositoryMock.findOneAndUpdate).toHaveBeenNthCalledWith(
      1,
      { _id: userId },
      { $set: { username: updatePayload.username } },
      projection
    );
  });

  test('should throw not found error during update - user not found by id', async () => {
    const userId = '61571de17f2b3f2d204a4138';
    const username = 'john2';
    const updatePayload = { username };
    const projection = { _id: 1, username: 1, email: 1 };
    userRepositoryMock.findOneAndUpdate.mockResolvedValue(null);

    try {
      await userService.updateUser(userId, updatePayload);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
    }

    expect(userRepositoryMock.findOneAndUpdate).toHaveBeenNthCalledWith(
      1,
      { _id: userId },
      { $set: { username: updatePayload.username } },
      projection
    );
  });

  test('should successfully delete user by id', async () => {
    const userId = '61571de17f2b3f2d204b5268';
    userRepositoryMock.deleteOne.mockResolvedValue({ deletedCount: 1 });

    const result = await userService.deleteUser(userId);

    expect(result).toEqual({ deletedCount: 1 });
    expect(userRepositoryMock.deleteOne).toHaveBeenNthCalledWith(1, {
      _id: userId
    });
  });

  test('should successfully get a list of users', async () => {
    const usersListMock = [
      {
        _id: '61571de17f2b3f2d204b5268',
        email: 'bob@gmail.com',
        username: 'bob1'
      },
      {
        _id: '61571ded7f2b3f2d204b526a',
        email: 'bob2@gmail.com',
        username: 'bob2'
      }
    ];
    const projection = { username: 1, email: 1 };
    userRepositoryMock.findAll.mockResolvedValue(usersListMock);

    const usersList = await userService.getUsers();

    expect(usersList).toEqual(usersListMock);
    expect(userRepositoryMock.findAll).toHaveBeenNthCalledWith(
      1,
      {},
      projection
    );
  });

  test('should successfully sign up new user', async () => {
    const userInput = {
      username: 'john',
      email: 'john@gmail.com',
      password: 'password'
    };

    await userService.signUpUser(userInput);

    expect(userRepositoryMock.create).toHaveBeenNthCalledWith(1, userInput);
  });

  test('should throw error during sign up - email already exists', async () => {
    const userInput = {
      username: 'john',
      email: 'john@gmail.com',
      password: 'password'
    };
    userRepositoryMock.create.mockRejectedValue(
      new ConflictException('UserEntity already exists')
    );

    try {
      await userService.signUpUser(userInput);
    } catch (error) {
      expect(error).toBeInstanceOf(ConflictException);
    }

    expect(userRepositoryMock.create).toHaveBeenNthCalledWith(1, userInput);
  });

  test('should successfully sign in user', async () => {
    const jwtTokenMock =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJlbWFpbCI6InRlc3RAZ21' +
      'haWwuY29tIiwiaWQiOiI2MTYzZGRjZWVmODhmNzE1ZDhkZDUzNDgiLCJpYXQiOjE2MzM5MzUxMTIsImV4cCI' +
      '6MTYzMzkzODcxMn0.cLwnq-zRqh1NgJbLbuGUD-MjYBAQ9LDm68lT8qFgVmg';
    const userInput = {
      email: 'test@gmail.com',
      password: '1234567890Test!'
    };
    const userId = '61571de17f2b3f2d204b5268';
    const userDetailsMock = {
      _id: userId,
      username: 'test',
      email: 'test@gmail.com',
      password: '$2b$10$CnkL0Zfas3zB59yj5cJWdebJVBeR/k0ucOUf6DSXLOeIMOAAaNCie'
    };
    const projection = {};
    userRepositoryMock.findOne.mockResolvedValue(userDetailsMock);
    jwtServiceMock.sign.mockReturnValue(jwtTokenMock);

    const result = await userService.signInUser(userInput);

    expect(result).toEqual({
      accessToken: jwtTokenMock
    });
    expect(userRepositoryMock.findOne).toHaveBeenNthCalledWith(
      1,
      { email: userInput.email },
      projection
    );
    expect(jwtServiceMock.sign).toHaveBeenNthCalledWith(1, {
      username: userDetailsMock.username,
      id: userDetailsMock._id,
      email: userDetailsMock.email
    });
  });

  test('should throw error during sign in - user does not exist', async () => {
    const userInput = {
      email: 'test@gmail.com',
      password: '1234567890Test!'
    };
    const projection = {};
    userRepositoryMock.findOne.mockResolvedValue(null);
    jwtServiceMock.sign.mockReturnValue(null);

    try {
      await userService.signInUser(userInput);
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
    }

    expect(userRepositoryMock.findOne).toHaveBeenNthCalledWith(
      1,
      { email: userInput.email },
      projection
    );
  });

  test('should throw error during sign - password incorrect', async () => {
    const userInput = {
      email: 'test@gmail.com',
      password: 'incorrect_password'
    };
    const userId = '61571de17f2b3f2d204b5268';
    const userDetailsMock = {
      _id: userId,
      username: 'test',
      email: 'test@gmail.com',
      password: '$2b$10$CnkL0Zfas3zB59yj5cJWdebJVBeR/k0ucOUf6DSXLOeIMOAAaNCie'
    };
    const projection = {};
    userRepositoryMock.findOne.mockResolvedValue(userDetailsMock);
    jwtServiceMock.sign.mockReturnValue(null);

    try {
      await userService.signInUser(userInput);
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
    }

    expect(userRepositoryMock.findOne).toHaveBeenNthCalledWith(
      1,
      { email: userInput.email },
      projection
    );
  });
});
