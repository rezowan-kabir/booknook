"use client";

import { useRouter } from "next/navigation";
// import { HeroSlider } from "@/components/banner";

export default function Home() {
  const router = useRouter();

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* <HeroSlider onBrowse={() => router.push("/books")} /> */}
    </section>
  );
}
