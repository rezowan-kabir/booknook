"use client";

import { useRouter } from "next/navigation";
import { HeroSlider } from "@/components/banner";
import { TopCategories } from "@/components/top-categories";
import { BorrowingSteps } from "@/components/borrowing-steps";
import { ReaderReviews } from "@/components/reader-reviews";

export default function Home() {
  const router = useRouter();

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <HeroSlider onBrowse={() => router.push("/books")} />
      <div className="mt-16">
        <TopCategories onBrowse={(category) => router.push("/books")} />
      </div>
      <div className="mt-16">
        <BorrowingSteps />
      </div>
      <div className="mt-16">
        <ReaderReviews />
      </div>
    </section>
  );
}
