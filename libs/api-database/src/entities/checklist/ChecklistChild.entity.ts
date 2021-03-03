import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Checklist } from './Checklist.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['checklistID'])
@Index(['childChecklistID'])
@Entity('fmchklstchildren')
export class ChecklistChild extends EntityProvider {
    @Column('int', { primary: true, name: 'clid', unsigned: true })
    checklistID: number;

    @Column('int', { primary: true, name: 'clidchild', unsigned: true })
    childChecklistID: number;

    @Column('int', { name: 'modifiedUid', unsigned: true })
    lastModifiedUID: number;

    @Column('datetime', { name: 'modifiedtimestamp', nullable: true })
    modifiedTimestamp: Date;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(
        () => Checklist,
        (fmchecklists) => fmchecklists.children,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'clidchild'}])
    parent: Checklist;

    // TODO: WTF is this?
    @ManyToOne(
        () => Checklist,
        (fmchecklists) => fmchecklists.asChild,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'clid'}])
    cl: Checklist;
}
