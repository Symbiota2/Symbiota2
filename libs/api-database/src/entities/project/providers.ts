import { Project } from './Project.entity';
import { ProjectCategory } from './ProjectCategory.entity'

export const providers = [
    Project.getProvider<Project>(),
    ProjectCategory.getProvider<ProjectCategory>()
];
