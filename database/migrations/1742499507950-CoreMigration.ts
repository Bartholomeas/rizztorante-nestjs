import type { MigrationInterface, QueryRunner } from "typeorm";

export class CoreMigration1742499507950 implements MigrationInterface {
  name = "CoreMigration1742499507950";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "order" ADD "data" jsonb NOT NULL DEFAULT '{}'`);
    await queryRunner.query(
      `CREATE INDEX "IDX_f7c756d04181019270bf20bac5" ON "cart"."cart_item" ("menuPositionId") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "cart"."IDX_f7c756d04181019270bf20bac5"`);
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "data"`);
  }
}
