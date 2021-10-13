import { ApiProperty } from '@nestjs/swagger';

export class UserUpdateEntity {
  @ApiProperty()
  username: string;
}
