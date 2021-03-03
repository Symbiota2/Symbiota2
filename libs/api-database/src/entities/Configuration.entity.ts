import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EntityProvider } from '../entity-provider.class';

@Entity({ name: 'configurations' })
export class Configuration extends EntityProvider {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'configurationName' })
    name: string;

    @Column({ name: 'configurationValue' })
    value: string;

    @Column({ name: 'configurationSide' })
    side: string;
}
