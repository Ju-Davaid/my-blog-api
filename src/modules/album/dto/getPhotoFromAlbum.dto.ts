import { IsInt, IsNumber, IsPositive } from 'class-validator';
import PageDTO from '../../../common/dto/page.dto.ts';
import { ApiProperty } from '@nestjs/swagger';

class GetPhotoFromAlbumDTO extends PageDTO {
  @ApiProperty({ description: '相册id' })
  @IsNumber({}, { message: 'id必须是数字' })
  @IsInt({ message: 'id必须是整数' })
  @IsPositive({ message: 'id必须是正数' })
  id: number;
}

export default GetPhotoFromAlbumDTO;
