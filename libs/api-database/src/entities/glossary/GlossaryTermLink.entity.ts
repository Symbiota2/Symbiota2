import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Glossary } from './Glossary.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index('Unique_termkeys', ['glossaryGroupID', 'glossaryID'], { unique: true })
@Index('glossarytermlink_ibfk_1', ['glossaryID'])
@Entity('glossarytermlink')
export class GlossaryTermLink extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'gltlinkid' })
    id: number;

    @Column('int', { name: 'glossgrpid', unsigned: true })
    glossaryGroupID: number;

    @Column('int', { name: 'glossid', unsigned: true })
    glossaryID: number;

    @Column('varchar', { name: 'relationshipType', nullable: true, length: 45 })
    relationshipType: string | null;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(() => Glossary, (glossary) => glossary.groupTermLinks, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'glossgrpid'}])
    glossaryGroup: Promise<Glossary>;

    @ManyToOne(() => Glossary, (glossary) => glossary.termLinks, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'glossid'}])
    glossary: Promise<Glossary>;
}
