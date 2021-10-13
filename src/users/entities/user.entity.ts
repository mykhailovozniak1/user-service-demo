import { ApiProperty } from '@nestjs/swagger';

export class UserEntity {
  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;
}
