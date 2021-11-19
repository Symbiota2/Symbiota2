import {
    BeforeInsert,
    Column,
    Entity, Index,
    JoinColumn, ManyToOne,
    PrimaryGeneratedColumn,
    BeforeUpdate
} from 'typeorm';
import { User } from './User.entity';
import { EntityProvider } from '../../entity-provider.class';
import { v4 as uuid4 } from 'uuid';

@Index(['clientID', 'token'])
@Entity('userRefreshTokens')
export class RefreshToken extends EntityProvider {
    public static readonly EXPIRES_IN_DAYS = 1;

    @Column('int', { name: 'uid', unsigned: true, primary: true })
    uid: number;

    @Column('varchar', { name: 'clientID', primary: true, length: 36, default: () => 'uuid()' })
    clientID: string;

    @Column('varchar', { name: 'token', primary: true, length: 36, default: () => 'uuid()'  })
    token: string;

    @Column('timestamp', { name: 'expiresAt', default: () => 'CURRENT_TIMESTAMP()' })
    expiresAt: Date;

    @ManyToOne(() => User, (user) => user.refreshToken, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'uid', referencedColumnName: 'uid' })
    user: Promise<User>;

    @BeforeInsert()
    @BeforeUpdate()
    setExpiry() {
        if (!this.expiresAt) {
            const expiresAtDate = new Date();
            expiresAtDate.setDate(
                expiresAtDate.getDate() + RefreshToken.EXPIRES_IN_DAYS
            );
            this.expiresAt = expiresAtDate;
        }
    }

    @BeforeInsert()
    setClientIDAndToken() {
        // See https://github.com/typeorm/typeorm/issues/7643
        if (!this.clientID) {
            this.clientID = uuid4();
        }
        if (!this.token) {
            this.token = uuid4();
        }
    }

    isExpired(): boolean {
        return this.expiresAt <= new Date();
    }
}
