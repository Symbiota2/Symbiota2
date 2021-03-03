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

@Index(['clientID', 'token'])
@Entity('userRefreshTokens')
export class RefreshToken extends EntityProvider {
    public static readonly EXPIRES_IN_DAYS = 1;

    @Column('int', { name: 'uid', unsigned: true, primary: true })
    uid: number;

    @PrimaryGeneratedColumn('uuid', { name: 'clientID' })
    clientID: string;

    @PrimaryGeneratedColumn('uuid', { name: 'token' })
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

    isExpired(): boolean {
        return this.expiresAt <= new Date();
    }
}
