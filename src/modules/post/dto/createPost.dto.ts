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
import { PostStatusEnum } from '../enum/PostEnum.ts';

class CreatePostDTO {
  @ApiProperty({ description: '文章标题' })
  @IsNotEmpty({ message: '文章标题不能为空' })
  @IsString({ message: '文章标题必须是字符串' })
  @MaxLength(200, { message: '文章标题最多100个字符' })
  title: string;

  @ApiProperty({ description: '文章描述' })
  @IsNotEmpty({ message: '文章描述不能为空' })
  @IsString({ message: '文章描述必须是字符串' })
  @MaxLength(200, { message: '文章描述最多200个字符' })
  desc: string;

  @ApiProperty({ description: '文章内容' })
  @IsNotEmpty({ message: '文章内容不能为空' })
  @IsString({ message: '文章内容必须是字符串' })
  content: string;

  @ApiProperty({ description: '文章封面' })
  @IsNotEmpty({ message: '文章封面不能为空' })
  @IsString({ message: '文章封面必须是字符串' })
  // @IsUrl({}, { message: '文章封面必须是URL' })
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

  @ApiProperty({ description: '分类ID', required: false, default: null })
  @IsNotEmpty({ message: '分类ID不能为空' })
  @IsNumber({}, { message: '分类ID必须是数字' })
  @IsOptional()
  categoryId: number | null = null;

  @ApiProperty({ description: '标签ID列表', required: false, default: '' })
  @IsNotEmpty({ message: '标签ID列表不能为空' })
  @IsString({ message: '标签ID列表必须是字符串' })
  @IsOptional()
  tagIds: string = '';

  @ApiProperty({
    description: '文章状态 0:草稿 1:已发布',
    required: false,
    default: 0,
  })
  @IsNumber({}, { message: '文章状态必须是数字' })
  @IsIn([0, 1], { message: '文章状态必须是0或1' })
  @IsOptional()
  status: PostStatusEnum = PostStatusEnum.Draft;
}

export default CreatePostDTO;
