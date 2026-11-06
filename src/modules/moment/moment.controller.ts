import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { MomentService } from './moment.service.js';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import CreateMomentDTO from './dto/createMoment.dto.ts';
import { Public, Role } from '../../common/decorator/auth.decorator.ts';
import RoleEnum from '../../common/enum/role.enum.ts';
import { FilesInterceptor } from '@nestjs/platform-express';
import GetMomentListDTO from './dto/getMomentList.dto.ts';
import DeleteMomentDTO from './dto/deleteMoment.dto.ts';

@Public()
@ApiTags('动态')
@Controller('moment')
export class MomentController {
  constructor(private readonly momentService: MomentService) {}

  /**
   * 创建动态
   * @param dto
   * @returns 动态实体
   */
  @Post('create')
  @ApiBearerAuth()
  @Role(RoleEnum.Admin)
  create(@Body() dto: CreateMomentDTO) {
    console.log(dto);
    return this.momentService.create(dto);
  }

  @Get('/list')
  @ApiOperation({ summary: '获取所有动态' })
  list(@Query() dto: GetMomentListDTO) {
    return this.momentService.list(dto);
  }

  @Get('delete')
  @Role(RoleEnum.Admin)
  @ApiOperation({ summary: '删除动态' })
  delete(@Query() dto: DeleteMomentDTO) {
    return this.momentService.delete(dto.id);
  }
}
