import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from './Project.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['projectID'])
@Entity('fmprojectcategories')
export class ProjectCategory extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'projcatid', unsigned: true })
    id: number;

    @Column('int', { name: 'pid', unsigned: true })
    projectID: number;

    @Column('varchar', { name: 'categoryname', length: 150 })
    category: string;

    @Column('varchar', { name: 'managers', nullable: true, length: 100 })
    managers: string;

    @Column('varchar', { name: 'description', nullable: true, length: 250 })
    description: string;

    @Column('int', { name: 'parentpid', nullable: true })
    parentProjectID: number | null;

    @Column('int', {
        name: 'occurrencesearch',
        nullable: true,
        default: () => '\'0\'',
    })
    occurrenceSearch: number | null;

    @Column('int', { name: 'ispublic', nullable: true, default: () => '\'1\'' })
    isPublic: number | null;

    @Column('varchar', { name: 'notes', nullable: true, length: 250 })
    notes: string;

    @Column('int', { name: 'sortsequence', nullable: true })
    sortSequence: number | null;

    @Column('timestamp', {
        name: 'initialtimestamp',
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(() => Project, (fmprojects) => fmprojects.categories, {
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
    })
    @JoinColumn([{ name: 'pid'}])
    project: Promise<Project>;
}
