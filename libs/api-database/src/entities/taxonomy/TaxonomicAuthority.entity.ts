import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TaxonomicStatus } from './TaxonomicStatus.entity';
import { TaxaEnumTreeEntry } from './TaxaEnumTreeEntry.entity';
import { EntityProvider } from '../../entity-provider.class';

@Entity()
export class TaxonomicAuthority extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
    id: number;

    @Column('int', { unsigned: true, default: () => "'0'" })
    isPrimary: number;

    @Column('varchar', { length: 45 })
    name: string;

    @Column('varchar', { nullable: true, length: 250 })
    description: string | null;

    @Column('varchar', { nullable: true, length: 150 })
    editors: string | null;

    @Column('varchar', { nullable: true, length: 45 })
    contact: string | null;

    @Column('varchar', { nullable: true, length: 100 })
    email: string | null;

    @Column('varchar', { nullable: true, length: 150 })
    url: string | null;

    @Column('varchar', { nullable: true, length: 250 })
    notes: string | null;

    @Column('int', { unsigned: true, default: () => "'1'" })
    isActive: number;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP()' })
    initialTimestamp: Date;

    @OneToMany(() => TaxonomicStatus, (taxstatus) => taxstatus.authority)
    taxonStatuses: Promise<TaxonomicStatus[]>;

    @OneToMany(() => TaxaEnumTreeEntry, (taxaenumtree) => taxaenumtree.taxonAuthority)
    enumTreeEntries: Promise<TaxaEnumTreeEntry[]>;
}
