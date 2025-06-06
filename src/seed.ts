import { UserRole } from "@common/types/user-roles.type";
import type { INestApplicationContext } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { Connection, DataSource } from "typeorm";

import { IngredientsConfigService } from "@/ingredients/ingredients-config/ingredients-config.service";

import { AppModule } from "./app.module";
import { AuthService } from "./auth/auth.service";
import type { CreateIngredientDto } from "./ingredients/dto/create-ingredient.dto";
import { CreateIngredientsConfigDto } from "./ingredients/ingredients-config/dto/create-ingredients-config.dto";
import { IngredientsService } from "./ingredients/ingredients.service";
import { UpdatePositionImageDto } from "./menu/dto/update/update-position-image.dto";
import { MenuAdminService } from "./menu/menu-admin/menu-admin.service";
import { MenuPublicService } from "./menu/menu-public/menu-public.service";
import { CreateOperatingHourDto } from "./restaurant-config/dto/operating-hour.dto";
import { CreateSpecialDateDto } from "./restaurant-config/dto/special-dates.dto";
import { RestaurantConfigService } from "./restaurant-config/restaurant-config.service";

(async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const menuAdminService = app.get(MenuAdminService);
  const menuPublicService = app.get(MenuPublicService);
  const authService = app.get(AuthService);
  const restaurantConfigService = app.get(RestaurantConfigService);
  const ingredientsService = app.get(IngredientsService);
  const ingredientsConfigurationService = app.get(IngredientsConfigService);

  try {
    // Clean the database
    await cleanDatabase(app.get(DataSource));

    // Create seed data
    await createRestaurantConfig(restaurantConfigService);
    await createMenu(menuAdminService);
    await createUsers(authService, app);
    await createIngredients(ingredientsService);
    await createIngredientsConfiguration(ingredientsConfigurationService, menuPublicService);

    console.log("Seeding completed");
  } catch (err) {
    console.log("Error seeding db: ", err);
  } finally {
    await app.close();
  }
})();

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

async function createRestaurantConfig(restaurantConfigService: RestaurantConfigService) {
  // Add operating hours
  const operatingHours: CreateOperatingHourDto[] = [];
  for (let dayOfWeek = 0; dayOfWeek <= 6; dayOfWeek++) {
    const singleOperatingHour = new CreateOperatingHourDto();
    singleOperatingHour.dayOfWeek = dayOfWeek;
    singleOperatingHour.isClosed = false;
    singleOperatingHour.isFullDay = false;
    singleOperatingHour.openingTime = "10:00";
    singleOperatingHour.closingTime = "22:00";

    operatingHours.push(singleOperatingHour);
  }
  for (const hour of operatingHours) {
    await restaurantConfigService.createOperatingHour(hour);
  }

  // Add special dates
  // const spceialDates: CreateSpecialDateDto[] = [];

  const specialDate1 = new CreateSpecialDateDto();
  specialDate1.openingTime = "10:00";
  specialDate1.closingTime = "16:00";
  specialDate1.isClosed = false;
  specialDate1.date = new Date("2024-12-12").toISOString();
  specialDate1.description = "Christmas Event SPOKO OK";
  await restaurantConfigService.createSpecialDate(specialDate1);

  const specialDate2 = new CreateSpecialDateDto();

  specialDate2.isClosed = true;
  specialDate2.date = new Date("2024-12-13").toISOString();
  specialDate2.description = "Zamkniete całe te";
  await restaurantConfigService.createSpecialDate(specialDate2);
}

async function createMenu(menuService: MenuAdminService) {
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

  const positionImage = new UpdatePositionImageDto();
  positionImage.id = "3d6535c9-be17-4f5d-b82f-566486919053";
  positionImage.url =
    "https://s3-rizztorante.s3.eu-central-1.amazonaws.com/3d6535c9-be17-4f5d-b82f-566486919053";
  positionImage.alt = "Spaghetti carbonara hehe";
  await menuService.updatePositionImage(createdPosition.id, positionImage);

  await menuService.createPositionDetails(createdPosition.id, {
    longDescription: "Updated long description",
    // images: ["image1", "image2"],
    allergens: ["peanuts", "gluten"],
    nutritionalInfo: {
      protein: 10,
      carbs: 20,
      fat: 30,
    },
  });

  await menuService.updatePositionDetails(createdPosition.id, {
    longDescription: "Updated long description",
    // images: ["image1", "image2"],
    allergens: ["peanuts", "gluten"],
    nutritionalInfo: {
      protein: 10,
      carbs: 20,
      fat: 30,
      fiber: 40,
    },
  });
}

async function createUsers(authService: AuthService, app: INestApplicationContext) {
  const user = await authService.registerUser({
    email: "test@gmail.com",
    password: "!23Haslo",
    confirmPassword: "!23Haslo",
  });

  const userService = await authService.registerUser({
    email: "test3@gmail.com",
    password: "!23Haslo",
    confirmPassword: "!23Haslo",
  });

  await authService.registerUser({
    email: "test2@gmail.com",
    password: "!23Haslo",
    confirmPassword: "!23Haslo",
  });

  await authService.createOrRetrieveGuestUser();
  await app
    .get(Connection)
    .query(`UPDATE "user" SET role = '${UserRole.ADMIN}' WHERE id = $1`, [user.id]);

  await app
    .get(Connection)
    .query(`UPDATE "user" SET role = '${UserRole.SERVICE}' WHERE id = $1`, [userService.id]);
}

async function createIngredients(ingredientsService: IngredientsService) {
  const ingredients: CreateIngredientDto[] = [
    {
      name: "Cheese",
      description: "A type of dairy product",
    },
    {
      name: "Tomato",
      description: "A juicy red fruit",
    },
    {
      name: "Mortadela",
      description: "A type of Italian sausage",
    },
    {
      name: "Guanchale",
      description: "A type of cured meat",
    },
    {
      name: "Ham",
      description: "A type of cured meat",
    },
    {
      name: "Salami",
      description: "A type of Italian cured meat",
    },
    {
      name: "Provolone",
      description: "A type of Italian cheese",
    },
    {
      name: "Pepperoni",
      description: "A type of Italian-American cured meat",
    },
    { name: "Mozarella Fior Di Latte" },
    { name: "Mozarella Di Buffala" },
  ];

  await Promise.all(
    ingredients.map((ingredient) => ingredientsService.createIngredient(ingredient)),
  );
}

async function createIngredientsConfiguration(
  ingredientsConfigurationService: IngredientsConfigService,
  menuService: MenuPublicService,
) {
  try {
    const menus = await menuService.getMenus();

    if (menus.length < 2) {
      console.log("Not enough menus found. Exiting function.");
      return;
    }
    const menuCategories1 = await menuService.getMenuCategories(menus[0].id);
    const menuCategories2 = await menuService.getMenuCategories(menus[1].id);

    const ingredientsConfiguration = new CreateIngredientsConfigDto();
    ingredientsConfiguration.name = "Pizza";
    ingredientsConfiguration.configurableIngredientIds = [];
    ingredientsConfiguration.menuPositionIds = [
      menuCategories1[0]?.positions[0]?.id,
      menuCategories2[0]?.positions[0]?.id,
    ];

    await ingredientsConfigurationService.createConfiguration(ingredientsConfiguration);
  } catch (err) {
    console.log("Error creating ingredients configuration: ", err);
  }
}
