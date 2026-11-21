import { ProductBuyBox } from "@/components/product/ProductBuyBox";
import { Hero } from "@/components/product/Hero";
import { ModeStory } from "@/components/product/ModeStory";
import { Benefits } from "@/components/product/Benefits";
import { Specs } from "@/components/product/Specs";
import { FinalCta } from "@/components/product/FinalCta";

export default function HomePage() {
  return (
    <>
      <Hero />

      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
        <ProductBuyBox />
      </div>

      <ModeStory />
      <Benefits />
      <Specs />
      <FinalCta />
    </>
  );
}
