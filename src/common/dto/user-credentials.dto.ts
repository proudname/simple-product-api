import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class UserCredentialsDto {
  @ApiProperty()
  @IsString()
  readonly email: string;
  @ApiProperty()
  @IsString()
  readonly password: string;
}

export default UserCredentialsDto;
