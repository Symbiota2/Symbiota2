import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ProjectCategory } from './ProjectCategory.entity';
import { ChecklistProjectLink } from '../checklist/ChecklistProjectLink.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['parentProjectID'])
@Entity('fmprojects')
export class Project extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'pid', unsigned: true })
    id: number;

    @Column('varchar', { name: 'projname', length: 90 })
    name: string;

    @Column('varchar', { name: 'displayname', nullable: true, length: 150 })
    displayName: string;

    @Column('varchar', { name: 'managers', nullable: true, length: 150 })
    managers: string;

    @Column('varchar', {
        name: 'briefdescription',
        nullable: true,
        length: 300
    })
    briefDescription: string;

    @Column('varchar', {
        name: 'fulldescription',
        nullable: true,
        length: 2000
    })
    fullDescription: string;

    @Column('varchar', { name: 'notes', nullable: true, length: 250 })
    notes: string;

    @Column('varchar', { name: 'iconUrl', nullable: true, length: 150 })
    iconUrl: string;

    @Column('varchar', { name: 'headerUrl', nullable: true, length: 150 })
    headerUrl: string;

    @Column('int', {
        name: 'occurrencesearch',
        unsigned: true,
        default: () => '\'0\'',
    })
    occurrenceSearch: number;

    @Column('int', { name: 'ispublic', unsigned: true, default: () => '\'0\'' })
    isPublic: number;

    @Column('text', { name: 'dynamicProperties', nullable: true })
    dynamicProperties: string;

    @Column('int', { name: 'parentpid', nullable: true, unsigned: true })
    parentProjectID: number | null;

    @Column('int', {
        name: 'SortSequence',
        unsigned: true,
        default: () => '\'50\'',
    })
    sortSequence: number;

    @Column('timestamp', {
        name: 'InitialTimeStamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @OneToMany(
        () => ProjectCategory,
        (fmprojectcategories) => fmprojectcategories.project
    )
    categories: Promise<ProjectCategory[]>;

    @ManyToOne(() => Project, (fmprojects) => fmprojects.childProjects, {
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
    })
    @JoinColumn([{ name: 'parentpid'}])
    parentProject: Promise<Project>;

    @OneToMany(() => Project, (fmprojects) => fmprojects.parentProject)
    childProjects: Promise<Project[]>;

    @OneToMany(() => ChecklistProjectLink, (fmchklstprojlink) => fmchklstprojlink.project)
    checklistProjectLinks: Promise<ChecklistProjectLink[]>;
}
