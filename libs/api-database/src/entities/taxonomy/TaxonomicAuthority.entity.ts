import { Column, Entity, getConnection, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TaxaNestedTreeEntry } from './TaxaNestedTreeEntry.entity';
import { UserTaxonomy } from './UserTaxonomy.entity';
import { TaxonomicStatus } from './TaxonomicStatus.entity';
import { TaxaEnumTreeEntry } from './TaxaEnumTreeEntry.entity';
import { EntityProvider } from '../../entity-provider.class';
import { TaxonomicUnit } from './TaxonomicUnit.entity';

@Entity('taxauthority')
export class TaxonomicAuthority extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'taxauthid', unsigned: true })
    id: number;

    @Column('int', { name: 'isprimary', unsigned: true, default: () => '\'0\'' })
    isPrimary: number;

    @Column('varchar', { name: 'name', length: 45 })
    name: string;

    @Column('varchar', { name: 'description', nullable: true, length: 250 })
    description: string | null;

    @Column('varchar', { name: 'editors', nullable: true, length: 150 })
    editors: string | null;

    @Column('varchar', { name: 'contact', nullable: true, length: 45 })
    contact: string | null;

    @Column('varchar', { name: 'email', nullable: true, length: 100 })
    email: string | null;

    @Column('varchar', { name: 'url', nullable: true, length: 150 })
    url: string | null;

    @Column('varchar', { name: 'notes', nullable: true, length: 250 })
    notes: string | null;

    @Column('int', { name: 'isactive', unsigned: true, default: () => '\'1\'' })
    isActive: number;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @OneToMany(() => TaxaNestedTreeEntry, (taxanestedtree) => taxanestedtree.taxonAuthority)
    nestedTreeEntries: Promise<TaxaNestedTreeEntry[]>;

    @OneToMany(() => UserTaxonomy, (usertaxonomy) => usertaxonomy.taxonomicAuthority)
    userTaxonomies: Promise<UserTaxonomy[]>;

    @OneToMany(() => TaxonomicStatus, (taxstatus) => taxstatus.authority)
    taxonStatuses: Promise<TaxonomicStatus[]>;

    @OneToMany(() => TaxaEnumTreeEntry, (taxaenumtree) => taxaenumtree.taxonAuthority)
    enumTreeEntries: Promise<TaxaEnumTreeEntry[]>;

    async getDefaultAuthorityID(): Promise<number> {
        const db = getConnection();
        const myRepo = db.getRepository(TaxonomicAuthority);
        const auth = await myRepo.findOne({
            isPrimary: 1
        });
        return auth.id
    }

}
