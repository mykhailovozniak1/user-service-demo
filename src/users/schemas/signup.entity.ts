import { ApiProperty } from '@nestjs/swagger';

export class SignupEntity {
  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
