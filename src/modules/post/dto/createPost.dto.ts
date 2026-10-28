import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

class CreatePostDTO {
  @ApiProperty({ description: '文章标题' })
  @IsNotEmpty({ message: '文章标题不能为空' })
  @IsString({ message: '文章标题必须是字符串' })
  @MaxLength(200, { message: '文章标题最多200个字符' })
  title: string;

  @ApiProperty({ description: '文章描述' })
  @IsNotEmpty({ message: '文章描述不能为空' })
  @IsString({ message: '文章描述必须是字符串' })
  @MaxLength(500, { message: '文章描述最多500个字符' })
  desc: string;

  @ApiProperty({ description: '文章内容' })
  @IsNotEmpty({ message: '文章内容不能为空' })
  @IsString({ message: '文章内容必须是字符串' })
  content: string;

  @ApiProperty({ description: '文章封面' })
  @IsNotEmpty({ message: '文章封面不能为空' })
  @IsString({ message: '文章封面必须是字符串' })
  @IsUrl({}, { message: '文章封面必须是URL' })
  cover: string;

  @ApiProperty({
    description: '是否置顶 0:否 1:是',
    required: false,
    default: 0,
  })
  @IsNumber({}, { message: '是否置顶必须是数字' })
  @IsIn([0, 1], { message: '是否置顶必须是0或1' })
  @IsOptional()
  pinned: number = 0;
}

export default CreatePostDTO;
