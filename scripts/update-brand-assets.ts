import "dotenv/config";
import { prisma } from "../src/lib/prisma";

const logos: Record<string, string> = {
  "les-senteurs-gourmandes": "/brands/les-senteurs-gourmandes.png",
  "jozz-beauty": "/brands/jozz-beauty.webp",
  "pur-eden": "/brands/pur-eden.svg",
  physiomins: "/brands/physiomins.png",
};

async function main() {
  for (const [slug, logoPath] of Object.entries(logos)) {
    await prisma.brand.update({ where: { slug }, data: { logoPath } });
  }
  console.log("Logos mis à jour pour", Object.keys(logos).length, "marques.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
