import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Checklist } from './Checklist.entity';
import { Project } from '../project';
import { EntityProvider } from '../../entity-provider.class';

@Index(['checklistID'])
@Entity('fmchklstprojlink')
export class ChecklistProjectLink extends EntityProvider {
    @Column('int', { primary: true, name: 'pid', unsigned: true })
    projectID: number;

    @Column('int', { primary: true, name: 'clid', unsigned: true })
    checklistID: number;

    @Column('varchar', { name: 'clNameOverride', nullable: true, length: 100 })
    checklistNameOverride: string;

    @Column('smallint', {
        name: 'mapChecklist',
        nullable: true,
        default: () => '\'1\'',
    })
    isMapChecklist: number | null;

    @Column('varchar', { name: 'notes', nullable: true, length: 250 })
    notes: string;

    @Column('timestamp', {
        name: 'InitialTimeStamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(
        () => Checklist,
        (fmchecklists) => fmchecklists.projectLinks,
        { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' }
    )
    @JoinColumn([{ name: 'clid'}])
    checklist: Promise<Checklist>;

    @ManyToOne(() => Project, (fmprojects) => fmprojects.checklistProjectLinks, {
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
    })
    @JoinColumn([{ name: 'pid'}])
    project: Promise<Project>;
}
