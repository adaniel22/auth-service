import { Migration } from '@mikro-orm/migrations';

export class Migration20260808143654 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "user" add column "refresh_token_hash" varchar(255) null;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "user" drop column "refresh_token_hash";`);
  }
}
