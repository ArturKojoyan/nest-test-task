import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { ProjectsService } from './projects.service';
import { UpdateProjectDto } from './dtos/update-project.dto';

@Controller('companies/:companyId/projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Roles('ADMIN', 'READ')
  @Get()
  async getAllProjects(@Param('companyId') companyId: string) {
    return this.projectsService.findAll(companyId);
  }

  @Patch(':id')
  @Roles('ADMIN', 'WRITE')
  async updateProject(
    @Body() updateProjectDto: UpdateProjectDto,
    @Param('id') id: string,
  ) {
    if (!updateProjectDto) {
      return new BadRequestException('payload is required');
    }

    const data = this.projectsService.updateOne(id, updateProjectDto);
    return data;
  }
}
