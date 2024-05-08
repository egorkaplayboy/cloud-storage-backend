import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1715185488538 implements MigrationInterface {
  name = 'Init1715185488538';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "login" text NOT NULL, "email" text NOT NULL, "name" text NOT NULL, "password" text NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."space_type_enum" AS ENUM('paid', 'free')`,
    );
    await queryRunner.query(
      `CREATE TABLE "space" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "type" "public"."space_type_enum" NOT NULL DEFAULT 'free', "totalMemory" integer NOT NULL DEFAULT '2024', "usedMemory" double precision NOT NULL DEFAULT '0', "maxFileSizeUpload" integer NOT NULL DEFAULT '100', "user_id" uuid, CONSTRAINT "PK_094f5ec727fe052956a11623640" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "files" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "filename" text NOT NULL, "originalName" text NOT NULL, "mimetype" text NOT NULL, "size" double precision NOT NULL, "data" bytea NOT NULL, "space_id" uuid, "user_id" uuid, CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "space" ADD CONSTRAINT "FK_dde71483196f43fd692689f1a21" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "files" ADD CONSTRAINT "FK_11902f244698607be0f25326d41" FOREIGN KEY ("space_id") REFERENCES "space"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "files" ADD CONSTRAINT "FK_a7435dbb7583938d5e7d1376041" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "files" DROP CONSTRAINT "FK_a7435dbb7583938d5e7d1376041"`,
    );
    await queryRunner.query(
      `ALTER TABLE "files" DROP CONSTRAINT "FK_11902f244698607be0f25326d41"`,
    );
    await queryRunner.query(
      `ALTER TABLE "space" DROP CONSTRAINT "FK_dde71483196f43fd692689f1a21"`,
    );
    await queryRunner.query(`DROP TABLE "files"`);
    await queryRunner.query(`DROP TABLE "space"`);
    await queryRunner.query(`DROP TYPE "public"."space_type_enum"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
