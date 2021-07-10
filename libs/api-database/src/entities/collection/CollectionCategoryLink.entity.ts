import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { CollectionCategory } from './CollectionCategory.entity';
import { Collection } from './Collection.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['collectionID'])
@Entity()
export class CollectionCategoryLink extends EntityProvider {
    @Column('int', { primary: true, unsigned: true })
    categoryID: number;

    @Column('int', { primary: true, unsigned: true })
    collectionID: number;

    @Column('tinyint', {
        nullable: true,
        width: 1,
        default: () => "1",
    })
    isPrimary: number | null;

    @Column('int', { nullable: true })
    sortSequence: number | null;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP()' })
    initialTimestamp: Date;

    @ManyToOne(
        () => CollectionCategory,
        (omcollcategories) => omcollcategories.collectionCategoryLinks,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn({ name: 'categoryID' })
    category: Promise<CollectionCategory>;

    @ManyToOne(
        () => Collection,
        (omcollections) => omcollections.categoryLinks,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn({ name: 'collectionID' })
    collection: Promise<Collection>;
}
