import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company, CompanyDocument } from '../schemas/company.schema';
import { Project, ProjectDocument } from '../schemas/project.schema';

@Injectable()
export class SeederService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) {}

  async seed() {
    // Clear existing data
    await this.companyModel.deleteMany({});
    await this.projectModel.deleteMany({});

    // Create mock companies
    const companies = await this.companyModel.insertMany([
      { name: 'Company A', industry: 'Software Engineering' },
      { name: 'Company B', address: 'Web Development' },
    ]);

    // Create mock projects for each company
    for (const company of companies) {
      await this.projectModel.insertMany([
        {
          name: 'Project 1',
          description: 'Description for Project 1',
          companyId: company._id,
          status: 'ACTIVE',
        },
        {
          name: 'Project 2',
          description: 'Description for Project 2',
          companyId: company._id,
          status: 'ACTIVE',
        },
      ]);
    }

    console.log('Mock data seeded successfully!');
  }
}
