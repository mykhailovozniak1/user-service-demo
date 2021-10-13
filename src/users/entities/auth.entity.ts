import { ApiProperty } from '@nestjs/swagger';

export class AuthEntity {
  @ApiProperty()
  password: string;

  @ApiProperty()
  email: string;
}
