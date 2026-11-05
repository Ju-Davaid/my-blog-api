import { IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class DeleteAlbumDTO {
  @ApiProperty({ description: '相册ID', type: 'number' })
  @IsNumber({}, { message: '相册ID必须是数字' })
  @IsNotEmpty()
  id: number;
}
export default DeleteAlbumDTO;
