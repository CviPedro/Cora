"use server";

import { getProductsByIds, getRecommended, type CardProduct } from "@/lib/products";

function cleanIds(ids: number[]) {
  return ids.filter((n) => Number.isInteger(n)).slice(0, 50);
}

export async function recommendedAction(ids: number[]): Promise<CardProduct[]> {
  return getRecommended(cleanIds(ids), 8);
}

export async function cartProductsAction(ids: number[]): Promise<CardProduct[]> {
  return getProductsByIds(cleanIds(ids));
}