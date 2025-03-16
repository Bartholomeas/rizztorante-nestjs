import type { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSchemas1742133047890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "menu"`);
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "user"`);
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "cart"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP SCHEMA IF EXISTS "menu" CASCADE`);
    await queryRunner.query(`DROP SCHEMA IF EXISTS "user" CASCADE`);
    await queryRunner.query(`DROP SCHEMA IF EXISTS "cart" CASCADE`);
  }
}
