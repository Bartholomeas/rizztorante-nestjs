import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";
import { MenuAdminService } from "./menu/menu-admin/menu-admin.service";

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const menuService = app.get(MenuAdminService);

  try {
    const menu1 = await menuService.createMenu({ name: "Lunch Menu", description: "Lunch Menu" });
    const menu2 = await menuService.createMenu({ name: "Dinner Menu", description: "Dinner Menu" });

    const appetizers = await menuService.createCategory({ name: "Appetizers", menuId: menu1.id });
    const mainCourses = await menuService.createCategory({
      name: "Main Courses",
      menuId: menu2.id,
    });

    await menuService.createPosition({
      name: "Caprese Salad",
      price: 1000, // Price in cents
      description: "Fresh mozzarella, tomatoes, and basil drizzled with balsamic glaze",
      ingredients: ["mozzarella", "tomatoes", "basil", "balsamic glaze"],
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: true,
      menuCategoryId: appetizers.id,
    });

    const XD = await menuService.createPosition({
      name: "Spaghetti Carbonara",
      price: 1500, // Price in cents
      description: "Classic Italian pasta dish with eggs, cheese, pancetta, and black pepper",
      ingredients: ["spaghetti", "eggs", "pecorino cheese", "pancetta", "black pepper"],
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      menuCategoryId: mainCourses.id,
    });

    console.log("XDDD", XD);

    await menuService.updatePositionDetails(XD.id, {
      description: "Updated description",
      longDescription: "Updated long description",
      images: ["image1", "image2"],
      allergens: ["peanuts", "gluten"],
      nutritionalInfo: {
        protein: 10,
        carbs: 20,
        fat: 30,
        fiber: 40,
      },
      name: "",
      price: 0,
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      menuCategoryId: XD.category.id,
    });

    console.log("Seeding completed");
  } catch (err) {
    console.log("Error seeding db: ", err);
  } finally {
    await app.close();
  }
}

bootstrap();
