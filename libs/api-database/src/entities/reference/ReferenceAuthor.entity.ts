import {
    Column,
    Entity,
    Index,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ReferenceAuthorLink } from './ReferenceAuthorLink.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index('INDEX_refauthlastname', ['lastName'])
@Entity('referenceauthors')
export class ReferenceAuthor extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'refauthorid' })
    id: number;

    @Column('varchar', { name: 'lastname', length: 100 })
    lastName: string;

    @Column('varchar', { name: 'firstname', nullable: true, length: 100 })
    firstName: string;

    @Column('varchar', { name: 'middlename', nullable: true, length: 100 })
    middleName: string;

    @Column('int', { name: 'modifieduid', nullable: true, unsigned: true })
    lastModifiedUID: number | null;

    @Column('datetime', { name: 'modifiedtimestamp', nullable: true })
    lastModifiedTimestamp: Date | null;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @OneToMany(
        () => ReferenceAuthorLink,
        (referenceauthorlink) => referenceauthorlink.author
    )
    referenceLinks: Promise<ReferenceAuthorLink[]>;
}
