import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ConfigPage } from './ConfigPage.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['configPageID'])
@Entity('configpageattributes')
export class ConfigPageAttribute extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'attributeid' })
    id: number;

    @Column('int', { name: 'configpageid' })
    configPageID: number;

    @Column('varchar', { name: 'objid', nullable: true, length: 45 })
    objectID: string;

    @Column('varchar', { name: 'objname', length: 45 })
    objectName: string;

    @Column('varchar', { name: 'value', nullable: true, length: 45 })
    value: string;

    @Column('varchar', {
        name: 'type',
        nullable: true,
        comment: 'text, submit, div',
        length: 45,
    })
    type: string;

    @Column('int', { name: 'width', nullable: true })
    width: number | null;

    @Column('int', { name: 'top', nullable: true })
    top: number | null;

    @Column('int', { name: 'left', nullable: true })
    left: number | null;

    @Column('varchar', { name: 'stylestr', nullable: true, length: 45 })
    styleStr: string;

    @Column('varchar', { name: 'notes', nullable: true, length: 250 })
    notes: string;

    @Column('int', { name: 'modifiedUid', unsigned: true })
    lastModifiedUID: number;

    @Column('datetime', { name: 'modifiedtimestamp', nullable: true })
    modifiedTimestamp: Date;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(
        () => ConfigPage,
        (configpage) => configpage.attributes,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{
        name: 'configpageid',

    }])
    configPage: Promise<ConfigPage>;
}
