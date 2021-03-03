import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Collection } from '../collection';
import { Reference } from './Reference.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['collectionID'])
@Entity('referencecollectionlink')
export class ReferenceCollectionLink extends EntityProvider {
    @Column('int', { primary: true, name: 'refid' })
    referenceID: number;

    @Column('int', { primary: true, name: 'collid', unsigned: true })
    collectionID: number;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(
        () => Collection,
        (omcollections) => omcollections.referenceCollectionLinks,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'collid'}])
    collection: Promise<Collection>;

    @ManyToOne(
        () => Reference,
        (referenceobject) => referenceobject.collectionLinks,
        { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' }
    )
    @JoinColumn([{ name: 'refid'}])
    reference: Promise<Reference>;
}
