import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { SpeciesUploadParameter } from './SpeciesUploadParameter.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index('Index_unique', ['uploadParameterID', 'symbSpecField', 'sourceField'], {
    unique: true,
})
@Entity('uploadspecmap')
export class SpeciesMapUpload extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'usmid', unsigned: true })
    id: number;

    @Column('int', { name: 'uspid', unsigned: true })
    uploadParameterID: number;

    @Column('varchar', { name: 'sourcefield', length: 45 })
    sourceField: string;

    @Column('varchar', {
        name: 'symbdatatype',
        comment: 'string, numeric, datetime',
        length: 45,
        default: () => '\'string\'',
    })
    symbDataType: string;

    @Column('varchar', { name: 'symbspecfield', length: 45 })
    symbSpecField: string;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(
        () => SpeciesUploadParameter,
        (uploadspecparameters) => uploadspecparameters.speciesMaps,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'uspid'}])
    uploadParameters: Promise<SpeciesUploadParameter>;
}
