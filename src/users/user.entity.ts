import {Entity, PrimaryKey, Property, Unique} from '@mikro-orm/core';
import {v4} from 'uuid';

@Entity()
export class User {
    @PrimaryKey() id: string = v4();

    @Property() @Unique() email!: string;

    @Property() password!: string;

    @Property() createdAt: Date = new Date();
}