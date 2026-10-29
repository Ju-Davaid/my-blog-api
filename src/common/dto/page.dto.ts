import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';

class PageDTO {
  @ApiProperty({ description: '每页数量', required: false, default: 10 })
  @IsInt({ message: '每页数量必须是整数' })
  @IsOptional()
  pageSize: number = 10;

  @ApiProperty({ description: '页码', required: false, default: 1 })
  @IsInt({ message: '页码必须是整数' })
  @IsOptional()
  pageNum: number = 1;
}

export default PageDTO;
