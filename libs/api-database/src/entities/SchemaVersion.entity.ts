import {
    Column,
    Entity,
    Index,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { EntityProvider } from '../entity-provider.class';

@Index('versionnumber_UNIQUE', ['versionNumber'], { unique: true })
@Entity('schemaversion')
export class SchemaVersion extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    id: number;

    @Column('varchar', { name: 'versionnumber', unique: true, length: 20 })
    versionNumber: string;

    @Column('timestamp', {
        name: 'dateapplied',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    dateApplied: Date;
}
