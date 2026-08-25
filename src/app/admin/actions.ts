"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  verifyPassword,
  setAdminSession,
  clearAdminSession,
  requireAdmin,
} from "@/lib/admin-auth";

export async function login(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (!verifyPassword(password)) {
    redirect("/admin/login?error=1");
  }
  await setAdminSession();
  redirect("/admin");
}

export async function logout() {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function markOrderFulfilled(orderId: string) {
  await requireAdmin();
  await prisma.order.update({ where: { id: orderId }, data: { status: "FULFILLED" } });
  revalidatePath("/admin");
}

export async function updateProduct(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const priceCents = Math.round(Number(formData.get("price")) * 100);
  const stock = Number(formData.get("stock"));
  const active = formData.get("active") === "on";

  if (
    !id ||
    !Number.isFinite(priceCents) ||
    priceCents < 0 ||
    !Number.isInteger(stock) ||
    stock < 0
  ) {
    throw new Error("Champs invalides.");
  }

  await prisma.product.update({ where: { id }, data: { priceCents, stock, active } });
  revalidatePath("/admin/produits");
}

export async function createProduct(formData: FormData) {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priceCents = Math.round(Number(formData.get("price")) * 100);
  const stock = Number(formData.get("stock")) || 0;
  const sku = String(formData.get("sku") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "");
  const brandId = String(formData.get("brandId") ?? "");

  if (
    !name ||
    !description ||
    !sku ||
    !categoryId ||
    !brandId ||
    !Number.isFinite(priceCents) ||
    priceCents <= 0
  ) {
    throw new Error("Champs invalides.");
  }

  const slug = slugify(name);

  await prisma.product.create({
    data: {
      name,
      description,
      priceCents,
      stock,
      sku,
      slug,
      categoryId,
      brandId,
      images: "[]",
    },
  });

  revalidatePath("/admin/produits");
  revalidatePath("/produits");
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
