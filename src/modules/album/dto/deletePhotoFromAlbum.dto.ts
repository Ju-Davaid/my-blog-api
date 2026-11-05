import { IsInt, IsNumber, IsPositive } from 'class-validator';

class DeletePhotoFromAlbumDTO {
  @IsNumber({}, { message: '照片id必须是数字' })
  @IsInt({ message: '照片id必须是整数' })
  @IsPositive({ message: '照片id必须是正数' })
  albumId: number;

  @IsNumber({}, { message: '照片id必须是数字' })
  @IsInt({ message: '照片id必须是整数' })
  @IsPositive({ message: '照片id必须是正数' })
  photoId: number;
}

export default DeletePhotoFromAlbumDTO;
