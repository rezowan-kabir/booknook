"use client";

import { useRouter } from "next/navigation";
import { HeroSlider } from "@/components/banner";
import { TopCategories } from "@/components/top-categories";

export function HomeHero() {
  const router = useRouter();

  return <HeroSlider onBrowse={() => router.push("/books")} />;
}

export function HomeTopCategories() {
  const router = useRouter();

  return (
    <TopCategories
      onBrowse={(category) => {
        if (category === "all") {
          router.push("/all-books");
          return;
        }

        const categoryName =
          category.charAt(0).toUpperCase() + category.slice(1);
        router.push(`/all-books?category=${categoryName}`);
      }}
    />
  );
}
