import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Paleochronostratigraphy } from '../Paleochronostratigraphy.entity';
import { Occurrence } from './Occurrence.entity';
import { EntityProvider } from '../../entity-provider.class';

// TODO: What is this?

@Index('Group', ['group'])
@Index('Formation', ['formation'])
@Index('Member', ['member'])
@Index(['chronoID'])
@Index(['occurrenceID'])
@Entity('omoccurlithostratigraphy')
export class OccurrenceLithostratigraphy extends EntityProvider {
    @Column('int', { primary: true, name: 'occid', unsigned: true })
    occurrenceID: number;

    @Column('int', { primary: true, name: 'chronoId', unsigned: true })
    chronoID: number;

    @Column('varchar', { name: 'Group', nullable: true, length: 255 })
    group: string | null;

    @Column('varchar', { name: 'Formation', nullable: true, length: 255 })
    formation: string | null;

    @Column('varchar', { name: 'Member', nullable: true, length: 255 })
    member: string | null;

    @Column('varchar', { name: 'Bed', nullable: true, length: 255 })
    bed: string | null;

    @ManyToOne(
        () => Paleochronostratigraphy,
        (paleochronostratigraphy) =>
            paleochronostratigraphy.lithostratigraphies,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'chronoId'}])
    chrono: Promise<Paleochronostratigraphy>;

    @ManyToOne(
        () => Occurrence,
        (omoccurrences) => omoccurrences.lithostratigraphies,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'occid'}])
    occurrence: Promise<Occurrence>;
}
