import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EntityProvider } from '../entity-provider.class';

@Entity({ name: 'configurations' })
export class Configuration extends EntityProvider {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column('varchar', { name: 'configurationName', nullable: true})
    name: string;

    @Column('varchar', { name: 'configurationValue', nullable: true })
    value: string;

    @Column('varchar', { name: 'configurationSide', nullable: true })
    side: string;
}
