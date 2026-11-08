import NewArrivals from "@/components/new-arrivals";
import { HomeHero, HomeTopCategories } from "@/components/home-navigation";
import { BorrowingSteps } from "@/components/borrowing-steps";
import { ReaderReviews } from "@/components/reader-reviews";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BookNook | Home",
};

export default function Home() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <HomeHero />
      <div className="mt-16">
        <NewArrivals />
      </div>
      <div className="mt-16">
        <HomeTopCategories />
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
