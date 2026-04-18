import prisma from "./prismaClient.js";

const products = [
  {
    name: "HAVIT HV-G92 Gamepad",
    description: "Responsive game controller for console and PC play.",
    price: 120,
    imageUrl: "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "AK-900 Wired Keyboard",
    description: "Full-size wired keyboard for fast everyday typing.",
    price: 960,
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "IPS LCD Gaming Monitor",
    description: "Sharp display with smooth motion for gaming setups.",
    price: 370,
    imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "S-Series Comfort Chair",
    description: "Comfortable chair for work, gaming, and study rooms.",
    price: 375,
    imageUrl: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "The North Coat",
    description: "Warm everyday coat with a clean city-ready profile.",
    price: 260,
    imageUrl: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Gucci Duffle Bag",
    description: "Spacious travel bag for weekend plans and daily carry.",
    price: 960,
    imageUrl: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "RGB Liquid CPU Cooler",
    description: "Compact cooling unit with bright RGB lighting.",
    price: 160,
    imageUrl: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Small BookShelf",
    description: "Minimal shelf for books, decor, and small essentials.",
    price: 360,
    imageUrl: "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=700&q=80",
  },
];

async function main() {
  const productCount = await prisma.product.count();

  if (productCount > 0) {
    console.log("Products already exist. Seed skipped.");
    return;
  }

  await prisma.product.createMany({
    data: products,
  });

  console.log(`Seeded ${products.length} products.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
