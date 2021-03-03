import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OccurrenceDuplicateLink } from './OccurrenceDuplicateLink.entity';
import { EntityProvider } from '../../entity-provider.class';

@Entity('omoccurduplicates')
export class OccurrenceDuplicate extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'duplicateid' })
    id: number;

    @Column('varchar', { name: 'title', length: 50 })
    title: string;

    @Column('varchar', { name: 'description', nullable: true, length: 255 })
    description: string | null;

    @Column('varchar', { name: 'notes', nullable: true, length: 255 })
    notes: string | null;

    @Column('varchar', {
        name: 'dupeType',
        length: 45,
        default: () => '\'Exact Duplicate\'',
    })
    type: string;

    @Column('timestamp', {
        name: 'initialTimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @OneToMany(
        () => OccurrenceDuplicateLink,
        (omoccurduplicatelink) => omoccurduplicatelink.duplicate
    )
    links: Promise<OccurrenceDuplicateLink[]>;
}
