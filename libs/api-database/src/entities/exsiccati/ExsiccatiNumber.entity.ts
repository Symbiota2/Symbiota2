import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ExsiccatiOccurrenceLink } from './ExsiccatiOccurrenceLink.entity';
import { ExsiccatiTitle } from './ExsiccatiTitle.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index('Index_omexsiccatinumbers_unique', ['exsiccatiNumber', 'exsiccatiTitleID'], {
    unique: true,
})
@Index(['exsiccatiTitleID'])
@Entity('omexsiccatinumbers')
export class ExsiccatiNumber extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'omenid', unsigned: true })
    id: number;

    @Column('varchar', { name: 'exsnumber', length: 45 })
    exsiccatiNumber: string;

    @Column('int', { name: 'ometid', unsigned: true })
    exsiccatiTitleID: number;

    @Column('varchar', { name: 'notes', nullable: true, length: 250 })
    notes: string | null;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @OneToMany(
        () => ExsiccatiOccurrenceLink,
        (omexsiccatiocclink) => omexsiccatiocclink.exsiccatiNumber
    )
    exsiccatiOccurrenceLinks: Promise<ExsiccatiOccurrenceLink[]>;

    @ManyToOne(
        () => ExsiccatiTitle,
        (omexsiccatititles) => omexsiccatititles.exsiccatiNumbers,
        { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' }
    )
    @JoinColumn([{ name: 'ometid'}])
    exsiccatiTitle: Promise<ExsiccatiTitle>;
}
