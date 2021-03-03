import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Checklist } from '../checklist';
import { Reference } from './Reference.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['referenceID'])
@Index(['checklistID'])
@Entity('referencechecklistlink')
export class ReferenceChecklistLink extends EntityProvider {
    @Column('int', { primary: true, name: 'refid' })
    referenceID: number;

    @Column('int', { primary: true, name: 'clid', unsigned: true })
    checklistID: number;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(
        () => Checklist,
        (fmchecklists) => fmchecklists.referenceLinks,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'clid'}])
    checklist: Promise<Checklist>;

    @ManyToOne(
        () => Reference,
        (referenceobject) => referenceobject.checklistLinks,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'refid'}])
    reference: Promise<Reference>;
}
