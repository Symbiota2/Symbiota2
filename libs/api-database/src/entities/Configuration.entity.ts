import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EntityProvider } from '../entity-provider.class';

@Entity({ name: 'configurations' })
export class Configuration extends EntityProvider {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column('varchar', { name: 'configurationName', length: 200, nullable: true})
    name: string;

    @Column('varchar', { name: 'configurationValue', length: 200, nullable: true })
    value: string;

    @Column('varchar', { name: 'configurationSide', length: 200, nullable: true })
    side: string;
}
