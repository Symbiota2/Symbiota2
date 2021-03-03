import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { ChecklistTaxonLink } from '../checklist';
import { Reference } from './Reference.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['checklistID', 'taxonID'])
@Entity('referencechklsttaxalink')
export class ReferenceChecklistTaxonLink extends EntityProvider {
    @Column('int', { primary: true, name: 'refid' })
    referenceID: number;

    @Column('int', { primary: true, name: 'clid', unsigned: true })
    checklistID: number;

    @Column('int', { primary: true, name: 'tid', unsigned: true })
    taxonID: number;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(
        () => ChecklistTaxonLink,
        (fmchklsttaxalink) => fmchklsttaxalink.referencedChecklistTaxonLink,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([
        { name: 'clid', 'referencedColumnName': 'checklistID' },
        { name: 'tid', 'referencedColumnName': 'taxonID' },
    ])
    checklistTaxonLink: Promise<ChecklistTaxonLink>;

    @ManyToOne(
        () => Reference,
        (referenceobject) => referenceobject.checklistTaxonLinks,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'refid'}])
    reference: Promise<Reference>;
}
