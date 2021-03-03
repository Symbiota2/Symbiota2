import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DynamicChecklistTaxonLink } from './DynamicChecklistTaxonLink.entity';
import { EntityProvider } from '../../entity-provider.class';

@Entity('fmdynamicchecklists')
export class DynamicChecklist extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'dynclid', unsigned: true })
    id: number;

    @Column('varchar', { name: 'name', nullable: true, length: 50 })
    name: string;

    @Column('varchar', { name: 'details', nullable: true, length: 250 })
    details: string;

    @Column('varchar', { name: 'uid', nullable: true, length: 45 })
    uid: string;

    @Column('varchar', {
        name: 'type',
        length: 45,
        default: () => '\'DynamicList\'',
    })
    type: string;

    @Column('varchar', { name: 'notes', nullable: true, length: 250 })
    notes: string;

    @Column('datetime', { name: 'expiration' })
    expiration: Date;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialtimestamp: Date;

    @OneToMany(() => DynamicChecklistTaxonLink, (fmdyncltaxalink) => fmdyncltaxalink.dynamicChecklist)
    dynamicChecklistTaxonLink: Promise<DynamicChecklistTaxonLink[]>;
}
