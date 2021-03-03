import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Image } from './Image.entity';
import { ImageProject } from './ImageProject.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['imageProjectID'])
@Entity('imageprojectlink')
export class ImageProjectLink extends EntityProvider {
    @Column('int', { primary: true, name: 'imgid', unsigned: true })
    imageID: number;

    @Column('int', { primary: true, name: 'imgprojid' })
    imageProjectID: number;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(() => Image, (images) => images.projectLinks, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'imgid'}])
    image: Image;

    @ManyToOne(
        () => ImageProject,
        (imageprojects) => imageprojects.links,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'imgprojid'}])
    imageProject: Promise<ImageProject>;
}
