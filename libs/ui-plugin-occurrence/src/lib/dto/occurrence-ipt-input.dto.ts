import {
    IsEnum, IsInt,
    IsNotEmpty,
    IsOptional
} from 'class-validator';
import { Expose, Type } from 'class-transformer';

/**
 * Object representing the body of a POST request for adding a new role to
 * a user
 */
export class IPTInputDto {
    constructor(iptLink: string) {
        this.iptLink = iptLink;
    }

    @IsNotEmpty()
    iptLink: string;
}
