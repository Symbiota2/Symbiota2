import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { CharacterState } from './CharacterState.entity';
import { AdminLanguage } from '../AdminLanguage.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['adminLanguageID'])
@Entity('kmcslang')
export class CharacterStateLanguage extends EntityProvider {
    @Column('int', { primary: true, name: 'cid', unsigned: true })
    characteristicID: number;

    @Column('varchar', { primary: true, name: 'cs', length: 16 })
    characterStateID: string;

    @Column('varchar', { name: 'charstatename', length: 150 })
    characterStateName: string;

    @Column('varchar', { name: 'language', length: 45 })
    language: string;

    @Column('int', { primary: true, name: 'langid' })
    adminLanguageID: number;

    @Column('varchar', { name: 'description', nullable: true, length: 255 })
    description: string | null;

    @Column('varchar', { name: 'notes', nullable: true, length: 255 })
    notes: string | null;

    @Column('timestamp', {
        name: 'intialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(() => CharacterState, (kmcs) => kmcs.characterStateLanguages, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([
        { name: 'cid', referencedColumnName: 'characteristicID'},
        { name: 'cs', referencedColumnName: 'characterState' },
    ])
    characterState: Promise<CharacterState>;

    @ManyToOne(
        () => AdminLanguage,
        (adminlanguages) => adminlanguages.characterStateLanguages,
        { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' }
    )
    @JoinColumn([{ name: 'langid'}])
    adminLanguage: Promise<AdminLanguage>;
}
