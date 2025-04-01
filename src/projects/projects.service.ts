import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Project, ProjectDocument } from 'src/schemas/project.schema';
import { UpdateProjectDto } from './dtos/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>,
  ) {}

  async findAll(companyId: string) {
    console.log('🚀 ~ ProjectsService ~ findAll ~ companyId:', companyId);
    if (!companyId) {
      throw new Error('Company ID is required');
    }

    let objectId: Types.ObjectId;
    try {
      objectId = new Types.ObjectId(companyId);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      throw new BadRequestException('Invalid Company ID format');
    }
    const projects = await this.projectModel
      .find({ companyId: objectId })
      .exec();
    return projects;
  }

  async updateOne(id: string, updateProjectDto: UpdateProjectDto) {
    const updatedProject = await this.projectModel.findByIdAndUpdate(
      id,
      updateProjectDto,
      { new: true },
    );

    if (!updatedProject) {
      throw new Error(`Project with ID ${id} not found`);
    }
    console.log(
      '🚀 ~ ProjectsService ~ updateOne ~ updatedProject:',
      updatedProject,
    );

    return updatedProject;
  }
}
