import { Exclude, Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@symbiota2/api-database';
import { ApiUser } from '@symbiota2/data-access';

/**
 * Object representing the body of a response containing user profile data
 */
@Exclude()
export class UserOutputDto implements ApiUser {
    public static readonly GROUP_SINGLE = 'single';
    public static readonly GROUP_LIST = 'list';

    constructor(userData?: User) {
        Object.assign(this, userData);
    }

    @ApiProperty()
    @Expose({ groups: [UserOutputDto.GROUP_SINGLE, UserOutputDto.GROUP_LIST] })
    uid: number;

    @ApiProperty()
    @Expose({ groups: [UserOutputDto.GROUP_SINGLE, UserOutputDto.GROUP_LIST] })
    username: string;

    @ApiProperty()
    @Expose({ groups: [UserOutputDto.GROUP_SINGLE, UserOutputDto.GROUP_LIST] })
    firstName: string;

    @ApiProperty()
    @Expose({ groups: [UserOutputDto.GROUP_SINGLE, UserOutputDto.GROUP_LIST] })
    lastName: string;

    @ApiProperty()
    @Expose({ groups: [UserOutputDto.GROUP_SINGLE] })
    title: string;

    @ApiProperty()
    @Expose({ groups: [UserOutputDto.GROUP_SINGLE] })
    institution: string;

    @ApiProperty()
    @Expose({ groups: [UserOutputDto.GROUP_SINGLE] })
    department: string;

    @ApiProperty()
    @Expose({ groups: [UserOutputDto.GROUP_SINGLE] })
    address: string;

    @ApiProperty()
    @Expose({ groups: [UserOutputDto.GROUP_SINGLE] })
    city: string;

    @ApiProperty()
    @Expose({ groups: [UserOutputDto.GROUP_SINGLE] })
    state: string;

    @ApiProperty()
    @Expose({ groups: [UserOutputDto.GROUP_SINGLE] })
    zip: string;

    @ApiProperty()
    @Expose({ groups: [UserOutputDto.GROUP_SINGLE] })
    country: string;

    @ApiProperty()
    @Expose({ groups: [UserOutputDto.GROUP_SINGLE] })
    phone: string;

    @ApiProperty()
    @Expose({ groups: [UserOutputDto.GROUP_SINGLE] })
    email: string;

    @ApiProperty()
    @Expose({ groups: [UserOutputDto.GROUP_SINGLE] })
    url: string;

    @ApiProperty()
    @Expose({ groups: [UserOutputDto.GROUP_SINGLE] })
    biography: string;

    @ApiProperty()
    @Expose({ groups: [UserOutputDto.GROUP_SINGLE] })
    @Transform(({ value }) => value === 1, { toClassOnly: true })
    isPublic: boolean;

    @ApiProperty()
    @Expose({ groups: [UserOutputDto.GROUP_SINGLE] })
    initialTimestamp: Date;

    @ApiProperty()
    @Expose({ groups: [UserOutputDto.GROUP_SINGLE] })
    lastLogin: Date;
}
