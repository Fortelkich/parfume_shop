import { PrismaClient, UserRole, Gender } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminIds = process.env.ADMIN_TELEGRAM_IDS?.split(",").map((id) => id.trim()).filter(Boolean);
  const adminId = adminIds?.[0] || "10001";

  await prisma.user.upsert({
    where: { id: adminId },
    update: { role: UserRole.ADMIN },
    create: {
      id: adminId,
      firstName: "Admin",
      lastName: "Noir",
      telegramUsername: "admin",
      role: UserRole.ADMIN
    }
  });

  const managerSeeds = [
    { id: "20001", firstName: "Elena", lastName: "Miller", telegramUsername: "elena_manager" },
    { id: "20002", firstName: "Artem", lastName: "Vasiliev", telegramUsername: "artem_manager" },
    { id: "20003", firstName: "Sofia", lastName: "Roy", telegramUsername: "sofia_manager" }
  ];

  for (const manager of managerSeeds) {
    await prisma.user.upsert({
      where: { id: manager.id },
      update: { role: UserRole.MANAGER },
      create: {
        ...manager,
        role: UserRole.MANAGER
      }
    });
  }

  await prisma.product.deleteMany();

  const products = [
    {
      title: "Noir Ambre",
      brand: "Maison Dore",
      price: 18500,
      volumeMl: 75,
      gender: Gender.UNISEX,
      concentration: "EDP",
      description: "Глубокий амбровый шлейф с мягкими смолами и дымной ванилью.",
      images: ["https://images.unsplash.com/photo-1523293182086-7651a899d37f"],
      inStock: true,
      sku: "MD-NA-075",
      topNotes: ["бергамот", "кардамон", "черный перец"],
      heartNotes: ["амбра", "ирис", "лабданум"],
      baseNotes: ["ваниль", "кедр", "мускус"]
    },
    {
      title: "Velvet Oud",
      brand: "Atelier Sombre",
      price: 22000,
      volumeMl: 50,
      gender: Gender.MALE,
      concentration: "EDP",
      description: "Теплый уд с оттенками кожи, специй и сушеного инжира.",
      images: ["https://images.unsplash.com/photo-1519681393784-d120267933ba"],
      inStock: true,
      sku: "AS-VO-050",
      topNotes: ["шафран", "гвоздика", "мускат"],
      heartNotes: ["уд", "кожа", "розовый перец"],
      baseNotes: ["пачули", "сандал", "амброксан"]
    },
    {
      title: "Rose Noire",
      brand: "Lumiere",
      price: 16500,
      volumeMl: 75,
      gender: Gender.FEMALE,
      concentration: "EDP",
      description: "Темная роза в окружении какао и черной смородины.",
      images: ["https://images.unsplash.com/photo-1497551060073-4c5ab6435f12"],
      inStock: true,
      sku: "LU-RN-075",
      topNotes: ["черная смородина", "гранат", "бергамот"],
      heartNotes: ["роза", "пион", "какао"],
      baseNotes: ["пачули", "ветивер", "мускус"]
    },
    {
      title: "Silk Tonka",
      brand: "Nuit Blanche",
      price: 14500,
      volumeMl: 50,
      gender: Gender.UNISEX,
      concentration: "EDP",
      description: "Сливочная тонка с оттенками миндаля и белого шоколада.",
      images: ["https://images.unsplash.com/photo-1487412720507-e7ab37603c6f"],
      inStock: true,
      sku: "NB-ST-050",
      topNotes: ["миндаль", "карамель", "груша"],
      heartNotes: ["тонка", "бобы ванили", "жасмин"],
      baseNotes: ["белый шоколад", "мускус", "сандал"]
    },
    {
      title: "Cedar Sillage",
      brand: "Orangerie",
      price: 13200,
      volumeMl: 100,
      gender: Gender.MALE,
      concentration: "EDT",
      description: "Сухие древесные ноты с аккордом бергамота и шалфея.",
      images: ["https://images.unsplash.com/photo-1452457576249-80ff83f71f25"],
      inStock: true,
      sku: "OR-CS-100",
      topNotes: ["бергамот", "грейпфрут", "шалфей"],
      heartNotes: ["кедр", "лаванда", "лист фиалки"],
      baseNotes: ["ветивер", "амбра", "мускус"]
    },
    {
      title: "Jardin Secret",
      brand: "Chateau",
      price: 17500,
      volumeMl: 75,
      gender: Gender.FEMALE,
      concentration: "EDP",
      description: "Садовый букет жасмина, нероли и спелого персика.",
      images: ["https://images.unsplash.com/photo-1501004318641-b39e6451bec6"],
      inStock: true,
      sku: "CH-JS-075",
      topNotes: ["нероли", "персик", "мандарин"],
      heartNotes: ["жасмин", "тубероза", "ландыш"],
      baseNotes: ["белый мускус", "амбра", "кедр"]
    },
    {
      title: "Smoke Iris",
      brand: "Obscura",
      price: 19800,
      volumeMl: 50,
      gender: Gender.UNISEX,
      concentration: "EDP",
      description: "Пудровый ирис с дымным аккордом и пепельным деревом.",
      images: ["https://images.unsplash.com/photo-1469474968028-56623f02e42e"],
      inStock: true,
      sku: "OB-SI-050",
      topNotes: ["фиалка", "бергамот", "кардамон"],
      heartNotes: ["ирис", "ладан", "чай"],
      baseNotes: ["дымный кедр", "мускус", "амброксан"]
    },
    {
      title: "Golden Fig",
      brand: "Maison Dore",
      price: 15400,
      volumeMl: 75,
      gender: Gender.UNISEX,
      concentration: "EDP",
      description: "Инжирные сливки с теплым бензоином и медом.",
      images: ["https://images.unsplash.com/photo-1470104240373-bc1812eddc9f"],
      inStock: true,
      sku: "MD-GF-075",
      topNotes: ["инжир", "мед", "бергамот"],
      heartNotes: ["кокос", "кедр", "корица"],
      baseNotes: ["бензоин", "ваниль", "мускус"]
    },
    {
      title: "Sable Musk",
      brand: "Atelier Sombre",
      price: 16200,
      volumeMl: 50,
      gender: Gender.MALE,
      concentration: "EDP",
      description: "Сухой мускус, черный чай и мягкая амбра.",
      images: ["https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"],
      inStock: true,
      sku: "AS-SM-050",
      topNotes: ["черный чай", "кедр", "шафран"],
      heartNotes: ["мускус", "лабданум", "какао"],
      baseNotes: ["амбра", "смолы", "пачули"]
    },
    {
      title: "Ivory Silk",
      brand: "Lumiere",
      price: 14900,
      volumeMl: 75,
      gender: Gender.FEMALE,
      concentration: "EDP",
      description: "Шелковистые белые цветы с кремовой ванилью.",
      images: ["https://images.unsplash.com/photo-1501004318641-b39e6451bec6"],
      inStock: true,
      sku: "LU-IS-075",
      topNotes: ["нероли", "альдегиды", "груша"],
      heartNotes: ["жасмин", "флердоранж", "ирис"],
      baseNotes: ["ваниль", "сандал", "мускус"]
    }
  ];

  await prisma.product.createMany({ data: products });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
