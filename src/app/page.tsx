"use client";

import { useRouter } from "next/navigation";
import { HeroSlider } from "@/components/banner";
import { BorrowingSteps } from "@/components/borrowing-steps";

export default function Home() {
  const router = useRouter();

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <HeroSlider onBrowse={() => router.push("/books")} />
      <div className="mt-16">
        <BorrowingSteps />
      </div>
    </section>
  );
}
