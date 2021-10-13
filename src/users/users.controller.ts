import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  UseGuards,
  Req,
  Param,
  BadRequestException
} from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UpdateUserDTO } from './dtos/update-user.dto';

import { UsersService } from './users.service';
import { AuthCredentialsDTO } from './dtos/auth-credentials.dto';
import { UserEntity } from './entities/user.entity';
import { AuthEntity } from './entities/auth.entity';
import { SignupEntity } from './schemas/signup.entity';
import { UserUpdateEntity } from './entities/user-update.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
  //TODO: Lab #3 refactoring use interfaces instead of classes in type
  constructor(private userService: UsersService) {}
  @ApiOkResponse({
    type: SignupEntity,
    isArray: false,
    description: 'Sign up and create new user'
  })
  @Post('/signup')
  public async signUpUser(@Body() body: CreateUserDTO) {
    return this.userService.signUpUser(body);
  }

  @ApiOkResponse({
    type: AuthEntity,
    isArray: false,
    description: 'Get user access token'
  })
  @Post('/signin')
  public async signInUser(@Body() body: AuthCredentialsDTO) {
    return this.userService.signInUser(body);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    type: UserEntity,
    isArray: true,
    description: 'Returns a list of users'
  })
  @Get()
  @UseGuards(AuthGuard())
  public async getUsers(@Req() req) {
    const users = await this.userService.getUsers();

    return {
      data: users,
      time: new Date()
    };
  }

  @ApiBearerAuth()
  @Get('/:id')
  @UseGuards(AuthGuard())
  public async getUser(@Param('id') id: string, @Req() req) {
    //TODO: Lab #3 refactoring - duplicated code 93, 104
    if (String(req?.user?._id) !== id) {
      throw new BadRequestException('id mismatch');
    }

    return this.userService.getUserDetails(id);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    type: UserUpdateEntity,
    isArray: false,
    description: 'Update username'
  })
  @Put('/:id')
  @UseGuards(AuthGuard())
  public async updateUser(
    @Param('id') id: string,
    @Body() body: UpdateUserDTO,
    @Req() req
  ) {
    if (String(req?.user?._id) !== id) {
      throw new BadRequestException('id mismatch');
    }

    return this.userService.updateUser(id, body);
  }

  @ApiBearerAuth()
  @Delete('/:id')
  @UseGuards(AuthGuard())
  public async deleteUser(@Param('id') id: string, @Req() req) {
    if (String(req?.user?._id) !== id) {
      throw new BadRequestException('id mismatch');
    }

    return this.userService.deleteUser(id);
  }
}
