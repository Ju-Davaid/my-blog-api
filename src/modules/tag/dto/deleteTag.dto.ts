import { IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class DeleteTagDTO {
  @ApiProperty({
    description: '标签ID',
  })
  @IsNumber({}, { message: '标签ID必须是数字' })
  @IsNotEmpty({ message: '标签ID不能为空' })
  @ApiProperty({ description: '标签ID' })
  id: number;
}
export default DeleteTagDTO;
