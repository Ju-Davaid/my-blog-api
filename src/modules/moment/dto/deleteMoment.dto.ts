import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsInt, IsPositive } from 'class-validator';

class DeleteMomentDTO {
  @ApiProperty({ description: '动态ID', type: 'number' })
  @IsNumber({}, { message: '动态ID必须是数字' })
  @IsInt({ message: '动态ID必须是整数' })
  @IsPositive({ message: '动态ID必须是正数' })
  @IsNotEmpty()
  id: number;
}
export default DeleteMomentDTO;
