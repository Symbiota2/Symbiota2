import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { ReferenceAuthor } from './ReferenceAuthor.entity';
import { Reference } from './Reference.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['referenceID'])
@Index(['authorID'])
@Entity('referenceauthorlink')
export class ReferenceAuthorLink extends EntityProvider {
    @Column('int', { primary: true, name: 'refid' })
    referenceID: number;

    @Column('int', { primary: true, name: 'refauthid' })
    authorID: number;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(
        () => ReferenceAuthor,
        (referenceauthors) => referenceauthors.referenceLinks,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'refauthid'}])
    author: Promise<ReferenceAuthor>;

    @ManyToOne(
        () => Reference,
        (referenceobject) => referenceobject.authorLinks,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'refid'}])
    reference: Promise<Reference>;
}
