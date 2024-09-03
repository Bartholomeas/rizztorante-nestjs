import { NestFactory } from "@nestjs/core";

import { Connection, DataSource } from "typeorm";

import { AppModule } from "./app.module";
import { AuthService } from "./auth/auth.service";
import { MenuAdminService } from "./menu/menu-admin/menu-admin.service";

async function cleanDatabase(dataSource: DataSource) {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    // Get all table names
    const tables = await queryRunner.query(`
        SELECT tablename FROM pg_tables
        WHERE schemaname = 'public';
      `);

    // Disable triggers
    await queryRunner.query("SET session_replication_role = replica;");

    // Truncate all tables
    for (const table of tables) {
      await queryRunner.query(`TRUNCATE TABLE "${table.tablename}" CASCADE;`);
    }

    // Re-enable triggers
    await queryRunner.query("SET session_replication_role = DEFAULT;");

    await queryRunner.commitTransaction();
  } catch (err) {
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    await queryRunner.release();
  }

  console.log("Database cleaned");
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const menuService = app.get(MenuAdminService);
  const authService = app.get(AuthService);

  try {
    // Clean the database
    await cleanDatabase(app.get(DataSource));
    const menu1 = await menuService.createMenu({ name: "Lunch Menu", description: "Lunch Menu" });
    const menu2 = await menuService.createMenu({ name: "Dinner Menu", description: "Dinner Menu" });

    const appetizers = await menuService.createCategory({ name: "Appetizers", menuId: menu1.id });
    const mainCourses = await menuService.createCategory({
      name: "Main Courses",
      menuId: menu2.id,
    });

    await menuService.createPosition({
      name: "Caprese Salad",
      price: 1000,
      description: "Fresh mozzarella, tomatoes, and basil drizzled with balsamic glaze",
      ingredients: ["mozzarella", "tomatoes", "basil", "balsamic glaze"],
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: true,
      menuCategoryId: appetizers.id,
    });

    const createdPosition = await menuService.createPosition({
      name: "Spaghetti Carbonara",
      price: 1500,
      description: "Classic Italian pasta dish with eggs, cheese, pancetta, and black pepper",
      ingredients: ["spaghetti", "eggs", "pecorino cheese", "pancetta", "black pepper"],
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      menuCategoryId: mainCourses.id,
    });

    await menuService.createPositionDetails(createdPosition.id, {
      longDescription: "Updated long description",
      images: ["image1", "image2"],
      allergens: ["peanuts", "gluten"],
      nutritionalInfo: {
        protein: 10,
        carbs: 20,
        fat: 30,
      },
    });

    await menuService.updatePositionDetails(createdPosition.id, {
      longDescription: "Updated long description",
      images: ["image1", "image2"],
      allergens: ["peanuts", "gluten"],
      nutritionalInfo: {
        protein: 10,
        carbs: 20,
        fat: 30,
        fiber: 40,
      },
    });

    const user = await authService.createUser({
      email: "test@gmail.com",
      password: "!23Haslo",
      confirmPassword: "!23Haslo",
    });

    await authService.createGuestUser();

    await app.get(Connection).query(`UPDATE "user" SET role = 'ADMIN' WHERE id = $1`, [user.id]);

    console.log("Seeding completed");
  } catch (err) {
    console.log("Error seeding db: ", err);
  } finally {
    await app.close();
  }
}

bootstrap();
