import { PartialType } from '@nestjs/swagger';
import CreateTagDTO from './createTag.dto.ts';

class UpdateTagDTO extends PartialType(CreateTagDTO) {}

export default UpdateTagDTO;
