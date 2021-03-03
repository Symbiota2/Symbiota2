import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { CollectionCategory } from './CollectionCategory.entity';
import { Collection } from './Collection.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['collectionID'])
@Entity('omcollcatlink')
export class CollectionCategoryLink extends EntityProvider {
    @Column('int', { primary: true, name: 'ccpk', unsigned: true })
    categoryID: number;

    @Column('int', { primary: true, name: 'collid', unsigned: true })
    collectionID: number;

    @Column('tinyint', {
        name: 'isPrimary',
        nullable: true,
        width: 1,
        default: () => '\'1\'',
    })
    isPrimary: number | null;

    @Column('int', { name: 'sortsequence', nullable: true })
    sortSequence: number | null;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(
        () => CollectionCategory,
        (omcollcategories) => omcollcategories.collectionCategoryLinks,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'ccpk'}])
    category: Promise<CollectionCategory>;

    @ManyToOne(
        () => Collection,
        (omcollections) => omcollections.collectionCategoryLinks,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'collid'}])
    collection: Promise<Collection>;
}
