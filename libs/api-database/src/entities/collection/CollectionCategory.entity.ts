import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CollectionCategoryLink } from './CollectionCategoryLink.entity';
import { EntityProvider } from '../../entity-provider.class';

@Entity('omcollcategories')
export class CollectionCategory extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'ccpk', unsigned: true })
    id: number;

    @Column('varchar', { name: 'category', length: 75 })
    category: string;

    @Column('varchar', { name: 'icon', nullable: true, length: 250 })
    icon: string | null;

    @Column('varchar', { name: 'acronym', nullable: true, length: 45 })
    acronym: string | null;

    @Column('varchar', { name: 'url', nullable: true, length: 250 })
    url: string | null;

    @Column('int', { name: 'inclusive', nullable: true, default: () => '\'1\'' })
    inclusive: number | null;

    @Column('varchar', { name: 'notes', nullable: true, length: 250 })
    notes: string | null;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @OneToMany(() => CollectionCategoryLink, (omcollcatlink) => omcollcatlink.category)
    collectionCategoryLinks: Promise<CollectionCategoryLink[]>;
}
