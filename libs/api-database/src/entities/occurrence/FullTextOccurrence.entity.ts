import { Column, Entity, Index } from 'typeorm';
import { EntityProvider } from '../../entity-provider.class';

@Index('ft_occur_locality', ['locality'], { fulltext: true })
@Index('ft_occur_recordedby', ['recordedBy'], { fulltext: true })
@Entity('omoccurrencesfulltext')
export class FullTextOccurrence extends EntityProvider {
    @Column('int', { primary: true, name: 'occid' })
    occurrenceID: number;

    @Column('text', { name: 'locality', nullable: true })
    locality: string;

    @Column('varchar', { name: 'recordedby', nullable: true, length: 255 })
    recordedBy: string;
}
