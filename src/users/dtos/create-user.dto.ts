import {
  IsString,
  MinLength,
  MaxLength,
  Matches
} from 'class-validator';

const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

export class CreateUserDTO {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(30)
  @Matches(EMAIL_REGEX, { message: 'email is not valid'})
  email: string;

  @MinLength(8)
  @MaxLength(20)
  @IsString()
  @Matches(PASSWORD_REGEX, {
    message: 'password is weak 1 upper 1 lower 1 numeric 1 special char'
  })
  password: string;
}
