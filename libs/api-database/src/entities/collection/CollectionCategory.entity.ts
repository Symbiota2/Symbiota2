import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CollectionCategoryLink } from './CollectionCategoryLink.entity';
import { EntityProvider } from '../../entity-provider.class';

@Entity()
export class CollectionCategory extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
    id: number;

    @Column('varchar', { length: 75 })
    name: string;

    @Column('varchar', { nullable: true, length: 250 })
    icon: string | null;

    @Column('varchar', { nullable: true, length: 45 })
    acronym: string | null;

    @Column('varchar', { nullable: true, length: 250 })
    url: string | null;

    @Column('int', { nullable: true, default: () => '\'1\'' })
    inclusive: number | null;

    @Column('varchar', { nullable: true, length: 250 })
    notes: string | null;

    @Column('timestamp', {
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @OneToMany(() => CollectionCategoryLink, (omcollcatlink) => omcollcatlink.category)
    collectionCategoryLinks: Promise<CollectionCategoryLink[]>;
}
