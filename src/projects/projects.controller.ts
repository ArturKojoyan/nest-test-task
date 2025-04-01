import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CustomRequest, RolesGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { ProjectsService } from './projects.service';
import { UpdateProjectDto } from './dtos/update-project.dto';

@Controller('project')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Roles('ADMIN', 'READ')
  @Get()
  async getAllProjects(@Req() req: CustomRequest) {
    const { companyId } = req.user;
    return this.projectsService.findAll(String(companyId));
  }

  @Patch(':id')
  @Roles('ADMIN', 'WRITE')
  async updateProject(
    @Body() updateProjectDto: UpdateProjectDto,
    @Param('id') id: string,
  ) {
    if (!id) {
      throw new BadRequestException('Project ID is required');
    }
    if (!updateProjectDto) {
      return new BadRequestException('payload is required');
    }

    try {
      const data = this.projectsService.updateOne(id, updateProjectDto);
      return data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      throw new BadRequestException(`Failed to update project with ID ${id}`);
    }
  }
}
