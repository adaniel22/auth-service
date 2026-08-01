import {
  BeforeCreate,
  Entity,
  Opt,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  @PrimaryKey() id: string = v4();

  @Property() @Unique() email!: string;

  @Property({ hidden: true }) password!: string;

  @Property({ onCreate: () => new Date() }) createdAt: Date & Opt = new Date();

  @BeforeCreate()
  async hashPassword(): Promise<void> {
    this.password = await bcrypt.hash(this.password, 12);
  }
}
