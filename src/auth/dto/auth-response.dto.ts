import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({ type: String, example: '<token>' })
  accessToken: string;
  @ApiProperty({ type: String, example: '<token>' })
  refreshToken: string;
}
