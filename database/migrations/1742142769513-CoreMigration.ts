import type { MigrationInterface, QueryRunner } from "typeorm";

export class CoreMigration1742142769513 implements MigrationInterface {
  name = "CoreMigration1742142769513";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "ingredients_config" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "UQ_3b24b90049eb756010f1adcb3ab" UNIQUE ("name"), CONSTRAINT "PK_4432ef5cc8dca88b55df54ad9a1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "ingredient_image" ("id" character varying NOT NULL, "url" character varying NOT NULL, "alt" character varying, "caption" character varying, CONSTRAINT "PK_db8b69e5cdff4c0da75fb67e6be" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "ingredient" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "isAvailable" boolean NOT NULL DEFAULT true, "isVegan" boolean NOT NULL DEFAULT false, "isVegetarian" boolean NOT NULL DEFAULT false, "isGlutenFree" boolean NOT NULL DEFAULT false, "imageId" character varying, CONSTRAINT "REL_a84a71ea6956ad453e4a8c5646" UNIQUE ("imageId"), CONSTRAINT "PK_6f1e945604a0b59f56a57570e98" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "configurable_ingredient" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "priceAdjustment" integer NOT NULL DEFAULT '0', "maxQuantity" integer NOT NULL DEFAULT '1', "ingredientId" uuid, CONSTRAINT "PK_a13796831482979ebc6e03ee13e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cart"."cart_item_configurable_ingredient" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" integer NOT NULL DEFAULT '1', "configurableIngredientId" uuid, CONSTRAINT "PK_9d5d22f8601a75278444a589dc8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cart"."cart_item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" integer NOT NULL DEFAULT '1', "amount" integer NOT NULL DEFAULT '0', "cartId" uuid, "menuPositionId" uuid, CONSTRAINT "PK_bd94725aa84f8cf37632bcde997" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "menu"."menu_position_details" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "longDescription" text, "calories" integer, "allergens" text, "nutritionalInfo" text, "menuPositionId" uuid, CONSTRAINT "REL_acb282246ea595719d63319bd1" UNIQUE ("menuPositionId"), CONSTRAINT "PK_366d8ecfd0599036ea1928cfc6f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_acb282246ea595719d63319bd1" ON "menu"."menu_position_details" ("menuPositionId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "menu"."menu_position_image" ("id" character varying NOT NULL, "url" character varying NOT NULL, "alt" character varying, "caption" character varying, "menuPositionId" uuid, CONSTRAINT "REL_03e33fdf63514916c59c6b2c0e" UNIQUE ("menuPositionId"), CONSTRAINT "PK_55c3e65bfcdcb91f05d29bd72e1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "menu_position_details_image" ("id" character varying NOT NULL, "url" character varying NOT NULL, "alt" character varying, "caption" character varying, "menuPositionDetailsId" uuid, CONSTRAINT "PK_748ce8aefab24292dd828bc5c82" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "menu"."menu_position" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "price" integer NOT NULL, "description" character varying, "isVegetarian" boolean NOT NULL DEFAULT false, "isVegan" boolean NOT NULL DEFAULT false, "isGlutenFree" boolean NOT NULL DEFAULT false, "categoryId" uuid, CONSTRAINT "CHK_b669fc8e7e557ee5669bc17e3f" CHECK ("price" >= 0), CONSTRAINT "PK_7f221584e90185672ef80976dbf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fc70e9ce7aba2ec8ce1d2c9fec" ON "menu"."menu_position" ("categoryId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "menu"."menu_category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "menuId" uuid, CONSTRAINT "PK_246dfbfa0f3b0a4e953f7490544" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bd179ebbb8882847d51d3a514b" ON "menu"."menu_category" ("menuId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "menu"."menu" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "slug" character varying NOT NULL, "description" character varying, "restaurantId" uuid, CONSTRAINT "UQ_c4d9533c4ce3f7902c786141e1a" UNIQUE ("slug"), CONSTRAINT "UQ_c4d9533c4ce3f7902c786141e1a" UNIQUE ("slug"), CONSTRAINT "PK_35b2a8f47d153ff7a41860cceeb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "restaurant" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "slug" character varying NOT NULL, "description" character varying, CONSTRAINT "UQ_cb7f1c337dcb0595ba6d44265f6" UNIQUE ("slug"), CONSTRAINT "PK_649e250d8b8165cb406d99aa30f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."order_orderstatus_enum" AS ENUM('PENDING', 'IN_PROGRESS', 'DELIVERY', 'FINISHED', 'CANCELED', 'COMPLETED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "order" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "orderNumber" character varying NOT NULL, "orderStatus" "public"."order_orderstatus_enum" NOT NULL DEFAULT 'PENDING', "checkoutData" jsonb, "userId" uuid, "cartId" uuid, "restaurantId" uuid, CONSTRAINT "UQ_4e9f8dd16ec084bca97b3262edb" UNIQUE ("orderNumber"), CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cart"."cart" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "total" integer NOT NULL DEFAULT '0', "userId" uuid, CONSTRAINT "REL_756f53ab9466eb52a52619ee01" UNIQUE ("userId"), CONSTRAINT "PK_c524ec48751b9b5bcfbf6e59be7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "notification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "body" text, "createdBy" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'ACTIVE', CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "notification_token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying NOT NULL, "deviceType" character varying, "status" character varying NOT NULL DEFAULT 'ACTIVE', "userId" uuid, CONSTRAINT "PK_99cf05a96c3aaf7dfd10b5740d0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "user"."user_role_enum" AS ENUM('ADMIN', 'USER', 'GUEST', 'SERVICE', 'DELIVERY', 'KITCHEN')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user"."user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying, "password" character varying, "role" "user"."user_role_enum" NOT NULL DEFAULT 'USER', "cartId" uuid, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "REL_342497b574edb2309ec8c6b62a" UNIQUE ("cartId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user"."user" ("email") `,
    );
    await queryRunner.query(
      `CREATE TABLE "special_date" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isClosed" boolean NOT NULL DEFAULT false, "date" date NOT NULL, "openingTime" TIME, "closingTime" TIME, "description" text, CONSTRAINT "PK_1200ace31a882159816759a3428" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."operating_hours_dayofweek_enum" AS ENUM('0', '1', '2', '3', '4', '5', '6')`,
    );
    await queryRunner.query(
      `CREATE TABLE "operating_hours" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "dayOfWeek" "public"."operating_hours_dayofweek_enum" NOT NULL, "isClosed" boolean NOT NULL DEFAULT false, "openingTime" TIME, "closingTime" TIME, CONSTRAINT "CHK_ecae15180ed757fbeb436535da" CHECK ("closingTime" > "openingTime"), CONSTRAINT "PK_2ada48e2269e8c902ec3f00439e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "opinion" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isApproved" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "rate" numeric NOT NULL, "comment" character varying, CONSTRAINT "PK_5ec733c275c9b9322cde468b4c1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "position_ingredients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "positionId" character varying NOT NULL, "ingredientId" character varying NOT NULL, CONSTRAINT "PK_698be64f44ff7027786b2e20ead" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sessions" ("id" character varying(255) NOT NULL, "expiredAt" bigint NOT NULL, "destroyedAt" TIMESTAMP, "json" text NOT NULL, "deletedAt" TIMESTAMP, CONSTRAINT "PK_3238ef96f18b355b671619111bc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4c1989542e47d9e3b98fe32c67" ON "sessions" ("expiredAt") `,
    );
    await queryRunner.query(
      `CREATE TABLE "ing_con_con_ing_con_ing" ("ingredientsConfigId" uuid NOT NULL, "configurableIngredientId" uuid NOT NULL, CONSTRAINT "PK_fcda918bb6236293eb50424fa18" PRIMARY KEY ("ingredientsConfigId", "configurableIngredientId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_764de8df94e3c6fe3ddbe9399b" ON "ing_con_con_ing_con_ing" ("ingredientsConfigId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bac2262b39d7e178205c654650" ON "ing_con_con_ing_con_ing" ("configurableIngredientId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "ingredients_config_menu_positions_menu_position" ("ingredientsConfigId" uuid NOT NULL, "menuPositionId" uuid NOT NULL, CONSTRAINT "PK_71b6069c6f1e67106c087cb4de7" PRIMARY KEY ("ingredientsConfigId", "menuPositionId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_356cd333b33eb66bfd8fe5b39d" ON "ingredients_config_menu_positions_menu_position" ("ingredientsConfigId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8ed5395ab7505a4a60a6cbb4c7" ON "ingredients_config_menu_positions_menu_position" ("menuPositionId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "cart"."cart_item_ingredients_cart_item_configurable_ingredient" ("cartItemId" uuid NOT NULL, "cartItemConfigurableIngredientId" uuid NOT NULL, CONSTRAINT "PK_2cb6eb56b86691f7fbbf959bc60" PRIMARY KEY ("cartItemId", "cartItemConfigurableIngredientId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f07088bd5609bf0032325bdc6f" ON "cart"."cart_item_ingredients_cart_item_configurable_ingredient" ("cartItemId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f9a5ea4e90d4642489c1e9607a" ON "cart"."cart_item_ingredients_cart_item_configurable_ingredient" ("cartItemConfigurableIngredientId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "restaurant_employees_user" ("restaurantId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_2b95f8eff83f1525ecfc0130f8c" PRIMARY KEY ("restaurantId", "userId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4f31e8d7efcd50448df182fbc6" ON "restaurant_employees_user" ("restaurantId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8dd82516beeed3f26eb906e23d" ON "restaurant_employees_user" ("userId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "notification_notification_tokens_notification_token" ("notificationId" uuid NOT NULL, "notificationTokenId" uuid NOT NULL, CONSTRAINT "PK_cc42dd00cf4b6dcf3148811ed8f" PRIMARY KEY ("notificationId", "notificationTokenId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2cf6140e3c0d2d4eda4caf2011" ON "notification_notification_tokens_notification_token" ("notificationId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_92e5ac6336ee3f66198bb3bcdd" ON "notification_notification_tokens_notification_token" ("notificationTokenId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "ingredient" ADD CONSTRAINT "FK_a84a71ea6956ad453e4a8c5646e" FOREIGN KEY ("imageId") REFERENCES "ingredient_image"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "configurable_ingredient" ADD CONSTRAINT "FK_d8f68810ea15ca2d1081a203e62" FOREIGN KEY ("ingredientId") REFERENCES "ingredient"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart"."cart_item_configurable_ingredient" ADD CONSTRAINT "FK_2ac15b09996a8b5027e3b605653" FOREIGN KEY ("configurableIngredientId") REFERENCES "configurable_ingredient"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart"."cart_item" ADD CONSTRAINT "FK_29e590514f9941296f3a2440d39" FOREIGN KEY ("cartId") REFERENCES "cart"."cart"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart"."cart_item" ADD CONSTRAINT "FK_f7c756d04181019270bf20bac58" FOREIGN KEY ("menuPositionId") REFERENCES "menu"."menu_position"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "menu"."menu_position_details" ADD CONSTRAINT "FK_acb282246ea595719d63319bd15" FOREIGN KEY ("menuPositionId") REFERENCES "menu"."menu_position"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "menu"."menu_position_image" ADD CONSTRAINT "FK_03e33fdf63514916c59c6b2c0e0" FOREIGN KEY ("menuPositionId") REFERENCES "menu"."menu_position"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "menu_position_details_image" ADD CONSTRAINT "FK_b99a659d41c7583fcc5e4f58ae9" FOREIGN KEY ("menuPositionDetailsId") REFERENCES "menu"."menu_position_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "menu"."menu_position" ADD CONSTRAINT "FK_fc70e9ce7aba2ec8ce1d2c9fec6" FOREIGN KEY ("categoryId") REFERENCES "menu"."menu_category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "menu"."menu_category" ADD CONSTRAINT "FK_bd179ebbb8882847d51d3a514bc" FOREIGN KEY ("menuId") REFERENCES "menu"."menu"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "menu"."menu" ADD CONSTRAINT "FK_085156de3c3a44eba017a6a0846" FOREIGN KEY ("restaurantId") REFERENCES "restaurant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_caabe91507b3379c7ba73637b84" FOREIGN KEY ("userId") REFERENCES "user"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_fe3963d525b2ee03ba471953a7c" FOREIGN KEY ("cartId") REFERENCES "cart"."cart"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_c93f22720c77241d2476c07cabf" FOREIGN KEY ("restaurantId") REFERENCES "restaurant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart"."cart" ADD CONSTRAINT "FK_756f53ab9466eb52a52619ee019" FOREIGN KEY ("userId") REFERENCES "user"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_token" ADD CONSTRAINT "FK_8c1dede7ba7256bff4e6155093c" FOREIGN KEY ("userId") REFERENCES "user"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user"."user" ADD CONSTRAINT "FK_342497b574edb2309ec8c6b62aa" FOREIGN KEY ("cartId") REFERENCES "cart"."cart"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ing_con_con_ing_con_ing" ADD CONSTRAINT "FK_764de8df94e3c6fe3ddbe9399b0" FOREIGN KEY ("ingredientsConfigId") REFERENCES "ingredients_config"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "ing_con_con_ing_con_ing" ADD CONSTRAINT "FK_bac2262b39d7e178205c6546504" FOREIGN KEY ("configurableIngredientId") REFERENCES "configurable_ingredient"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ingredients_config_menu_positions_menu_position" ADD CONSTRAINT "FK_356cd333b33eb66bfd8fe5b39d8" FOREIGN KEY ("ingredientsConfigId") REFERENCES "ingredients_config"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "ingredients_config_menu_positions_menu_position" ADD CONSTRAINT "FK_8ed5395ab7505a4a60a6cbb4c72" FOREIGN KEY ("menuPositionId") REFERENCES "menu"."menu_position"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart"."cart_item_ingredients_cart_item_configurable_ingredient" ADD CONSTRAINT "FK_f07088bd5609bf0032325bdc6f9" FOREIGN KEY ("cartItemId") REFERENCES "cart"."cart_item"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart"."cart_item_ingredients_cart_item_configurable_ingredient" ADD CONSTRAINT "FK_f9a5ea4e90d4642489c1e9607ae" FOREIGN KEY ("cartItemConfigurableIngredientId") REFERENCES "cart"."cart_item_configurable_ingredient"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant_employees_user" ADD CONSTRAINT "FK_4f31e8d7efcd50448df182fbc65" FOREIGN KEY ("restaurantId") REFERENCES "restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant_employees_user" ADD CONSTRAINT "FK_8dd82516beeed3f26eb906e23d9" FOREIGN KEY ("userId") REFERENCES "user"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_notification_tokens_notification_token" ADD CONSTRAINT "FK_2cf6140e3c0d2d4eda4caf20110" FOREIGN KEY ("notificationId") REFERENCES "notification"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_notification_tokens_notification_token" ADD CONSTRAINT "FK_92e5ac6336ee3f66198bb3bcddd" FOREIGN KEY ("notificationTokenId") REFERENCES "notification_token"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification_notification_tokens_notification_token" DROP CONSTRAINT "FK_92e5ac6336ee3f66198bb3bcddd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_notification_tokens_notification_token" DROP CONSTRAINT "FK_2cf6140e3c0d2d4eda4caf20110"`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant_employees_user" DROP CONSTRAINT "FK_8dd82516beeed3f26eb906e23d9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant_employees_user" DROP CONSTRAINT "FK_4f31e8d7efcd50448df182fbc65"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart"."cart_item_ingredients_cart_item_configurable_ingredient" DROP CONSTRAINT "FK_f9a5ea4e90d4642489c1e9607ae"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart"."cart_item_ingredients_cart_item_configurable_ingredient" DROP CONSTRAINT "FK_f07088bd5609bf0032325bdc6f9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ingredients_config_menu_positions_menu_position" DROP CONSTRAINT "FK_8ed5395ab7505a4a60a6cbb4c72"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ingredients_config_menu_positions_menu_position" DROP CONSTRAINT "FK_356cd333b33eb66bfd8fe5b39d8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ing_con_con_ing_con_ing" DROP CONSTRAINT "FK_bac2262b39d7e178205c6546504"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ing_con_con_ing_con_ing" DROP CONSTRAINT "FK_764de8df94e3c6fe3ddbe9399b0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user"."user" DROP CONSTRAINT "FK_342497b574edb2309ec8c6b62aa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_token" DROP CONSTRAINT "FK_8c1dede7ba7256bff4e6155093c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart"."cart" DROP CONSTRAINT "FK_756f53ab9466eb52a52619ee019"`,
    );
    await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_c93f22720c77241d2476c07cabf"`);
    await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_fe3963d525b2ee03ba471953a7c"`);
    await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_caabe91507b3379c7ba73637b84"`);
    await queryRunner.query(
      `ALTER TABLE "menu"."menu" DROP CONSTRAINT "FK_085156de3c3a44eba017a6a0846"`,
    );
    await queryRunner.query(
      `ALTER TABLE "menu"."menu_category" DROP CONSTRAINT "FK_bd179ebbb8882847d51d3a514bc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "menu"."menu_position" DROP CONSTRAINT "FK_fc70e9ce7aba2ec8ce1d2c9fec6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "menu_position_details_image" DROP CONSTRAINT "FK_b99a659d41c7583fcc5e4f58ae9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "menu"."menu_position_image" DROP CONSTRAINT "FK_03e33fdf63514916c59c6b2c0e0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "menu"."menu_position_details" DROP CONSTRAINT "FK_acb282246ea595719d63319bd15"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart"."cart_item" DROP CONSTRAINT "FK_f7c756d04181019270bf20bac58"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart"."cart_item" DROP CONSTRAINT "FK_29e590514f9941296f3a2440d39"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart"."cart_item_configurable_ingredient" DROP CONSTRAINT "FK_2ac15b09996a8b5027e3b605653"`,
    );
    await queryRunner.query(
      `ALTER TABLE "configurable_ingredient" DROP CONSTRAINT "FK_d8f68810ea15ca2d1081a203e62"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ingredient" DROP CONSTRAINT "FK_a84a71ea6956ad453e4a8c5646e"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_92e5ac6336ee3f66198bb3bcdd"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_2cf6140e3c0d2d4eda4caf2011"`);
    await queryRunner.query(`DROP TABLE "notification_notification_tokens_notification_token"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_8dd82516beeed3f26eb906e23d"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_4f31e8d7efcd50448df182fbc6"`);
    await queryRunner.query(`DROP TABLE "restaurant_employees_user"`);
    await queryRunner.query(`DROP INDEX "cart"."IDX_f9a5ea4e90d4642489c1e9607a"`);
    await queryRunner.query(`DROP INDEX "cart"."IDX_f07088bd5609bf0032325bdc6f"`);
    await queryRunner.query(
      `DROP TABLE "cart"."cart_item_ingredients_cart_item_configurable_ingredient"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_8ed5395ab7505a4a60a6cbb4c7"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_356cd333b33eb66bfd8fe5b39d"`);
    await queryRunner.query(`DROP TABLE "ingredients_config_menu_positions_menu_position"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_bac2262b39d7e178205c654650"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_764de8df94e3c6fe3ddbe9399b"`);
    await queryRunner.query(`DROP TABLE "ing_con_con_ing_con_ing"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_4c1989542e47d9e3b98fe32c67"`);
    await queryRunner.query(`DROP TABLE "sessions"`);
    await queryRunner.query(`DROP TABLE "position_ingredients"`);
    await queryRunner.query(`DROP TABLE "opinion"`);
    await queryRunner.query(`DROP TABLE "operating_hours"`);
    await queryRunner.query(`DROP TYPE "public"."operating_hours_dayofweek_enum"`);
    await queryRunner.query(`DROP TABLE "special_date"`);
    await queryRunner.query(`DROP INDEX "user"."IDX_e12875dfb3b1d92d7d7c5377e2"`);
    await queryRunner.query(`DROP TABLE "user"."user"`);
    await queryRunner.query(`DROP TYPE "user"."user_role_enum"`);
    await queryRunner.query(`DROP TABLE "notification_token"`);
    await queryRunner.query(`DROP TABLE "notification"`);
    await queryRunner.query(`DROP TABLE "cart"."cart"`);
    await queryRunner.query(`DROP TABLE "order"`);
    await queryRunner.query(`DROP TYPE "public"."order_orderstatus_enum"`);
    await queryRunner.query(`DROP TABLE "restaurant"`);
    await queryRunner.query(`DROP TABLE "menu"."menu"`);
    await queryRunner.query(`DROP INDEX "menu"."IDX_bd179ebbb8882847d51d3a514b"`);
    await queryRunner.query(`DROP TABLE "menu"."menu_category"`);
    await queryRunner.query(`DROP INDEX "menu"."IDX_fc70e9ce7aba2ec8ce1d2c9fec"`);
    await queryRunner.query(`DROP TABLE "menu"."menu_position"`);
    await queryRunner.query(`DROP TABLE "menu_position_details_image"`);
    await queryRunner.query(`DROP TABLE "menu"."menu_position_image"`);
    await queryRunner.query(`DROP INDEX "menu"."IDX_acb282246ea595719d63319bd1"`);
    await queryRunner.query(`DROP TABLE "menu"."menu_position_details"`);
    await queryRunner.query(`DROP TABLE "cart"."cart_item"`);
    await queryRunner.query(`DROP TABLE "cart"."cart_item_configurable_ingredient"`);
    await queryRunner.query(`DROP TABLE "configurable_ingredient"`);
    await queryRunner.query(`DROP TABLE "ingredient"`);
    await queryRunner.query(`DROP TABLE "ingredient_image"`);
    await queryRunner.query(`DROP TABLE "ingredients_config"`);
  }
}
