import { Category } from "@/types/animal-category";
import { cacheLife } from "next/cache";
import HomeClient from "./HomeClient";

export const metadata = {
  title: "PashuSetu - Animal & Cattle Marketplace",
  description: "India's Leading Animal & Cattle OLX Marketplace. Buy and sell cows, buffaloes, pets, and accessories in your local neighborhood.",
};

async function getCategories(): Promise<Category[]> {
  "use cache";
  cacheLife("hours"); // Cache categories server-side for hours

  try {
    const res = await fetch("http://localhost:4000/api/v1/animal/categories");
    if (!res.ok) {
      console.error(`Failed to fetch categories: ${res.status}`);
      return [];
    }
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Error fetching categories on server:", error);
    return [];
  }
}

export default async function Home() {
  const categories = await getCategories();

  return <HomeClient initialCategories={categories} />;
}
