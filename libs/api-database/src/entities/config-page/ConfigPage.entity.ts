import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ConfigPageAttribute } from './ConfigPageAttribute.entity';
import { EntityProvider } from '../../entity-provider.class';

@Entity('configpage')
export class ConfigPage extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'configpageid' })
    id: number;

    @Column('varchar', { name: 'pagename', length: 45 })
    name: string;

    @Column('varchar', { name: 'title', length: 150 })
    title: string;

    @Column('varchar', { name: 'cssname', nullable: true, length: 45 })
    cssName: string;

    @Column('varchar', {
        name: 'language',
        length: 45,
        default: () => '\'english\'',
    })
    language: string;

    @Column('int', { name: 'displaymode', nullable: true })
    displayMode: number | null;

    @Column('varchar', { name: 'notes', nullable: true, length: 250 })
    notes: string;

    @Column('int', { name: 'modifiedUid', unsigned: true })
    lastModifiedUID: number;

    @Column('datetime', { name: 'modifiedtimestamp', nullable: true })
    modifiedTimestamp: Date | null;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @OneToMany(
        () => ConfigPageAttribute,
        (configpageattributes) => configpageattributes.configPage
    )
    attributes: Promise<ConfigPageAttribute[]>;
}
