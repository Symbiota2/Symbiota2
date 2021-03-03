import {
    Column,
    Entity,
    Index,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { OccurrenceLithostratigraphy } from './occurrence';
import { EntityProvider } from '../entity-provider.class';

@Index('Eon', ['eon'])
@Index('Era', ['era'])
@Index('Period', ['period'])
@Index('Epoch', ['epoch'])
@Index('Stage', ['stage'])
@Entity('paleochronostratigraphy')
export class Paleochronostratigraphy extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'chronoId', unsigned: true })
    id: number;

    @Column('varchar', { name: 'Eon', nullable: true, length: 255 })
    eon: string | null;

    @Column('varchar', { name: 'Era', nullable: true, length: 255 })
    era: string | null;

    @Column('varchar', { name: 'Period', nullable: true, length: 255 })
    period: string | null;

    @Column('varchar', { name: 'Epoch', nullable: true, length: 255 })
    epoch: string | null;

    @Column('varchar', { name: 'Stage', nullable: true, length: 255 })
    stage: string | null;

    @OneToMany(
        () => OccurrenceLithostratigraphy,
        (omoccurlithostratigraphy) => omoccurlithostratigraphy.chrono
    )
    lithostratigraphies: Promise<OccurrenceLithostratigraphy[]>;
}
