import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { GlossaryImage } from './GlossaryImage.entity';
import { GlossaryTermLink } from './GlossaryTermLink.entity';
import { GlossaryTaxonLink } from './GlossaryTaxonLink.entity';
import { User } from '../user/User.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index('Index_term', ['term'])
@Index('Index_glossary_lang', ['language'])
@Index(['creatorUID'])
@Entity('glossary')
export class Glossary extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'glossid', unsigned: true })
    id: number;

    @Column('varchar', { name: 'term', length: 150 })
    term: string;

    @Column('varchar', { name: 'definition', nullable: true, length: 2000 })
    definition: string;

    @Column('varchar', {
        name: 'language',
        length: 45,
        default: () => '\'English\'',
    })
    language: string;

    @Column('varchar', { name: 'source', nullable: true, length: 1000 })
    source: string;

    @Column('varchar', { name: 'notes', nullable: true, length: 250 })
    notes: string;

    @Column('varchar', { name: 'resourceurl', nullable: true, length: 600 })
    resourceURL: string;

    @Column('int', { name: 'uid', nullable: true, unsigned: true })
    creatorUID: number | null;

    @Column('varchar', { name: 'translator', length: 250, nullable: true })
    translator: string;

    @Column('varchar', { name: 'author', length: 250, nullable: true })
    author: string;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @OneToMany(() => GlossaryImage, (glossaryimages) => glossaryimages.glossary)
    images: Promise<GlossaryImage[]>;

    @OneToMany(
        () => GlossaryTermLink,
        (glossarytermlink) => glossarytermlink.glossaryGroup
    )
    groupTermLinks: Promise<GlossaryTermLink[]>;

    @OneToMany(
        () => GlossaryTermLink,
        (glossarytermlink) => glossarytermlink.glossary
    )
    termLinks: Promise<GlossaryTermLink[]>;

    @OneToMany(
        () => GlossaryTaxonLink,
        (glossarytaxalink) => glossarytaxalink.glossary
    )
    taxonLinks: Promise<GlossaryTaxonLink[]>;

    @ManyToOne(() => User, (users) => users.glossaries, {
        onDelete: 'SET NULL',
        onUpdate: 'SET NULL',
    })
    @JoinColumn([{ name: 'uid', referencedColumnName: 'uid' }])
    creator: Promise<User>;
}
