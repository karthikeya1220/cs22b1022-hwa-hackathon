import { ProductBuyBox } from "@/components/product/ProductBuyBox";
import { Hero } from "@/components/product/Hero";
import { ModeStory } from "@/components/product/ModeStory";
import { Benefits } from "@/components/product/Benefits";
import { Specs } from "@/components/product/Specs";
import { FinalCta } from "@/components/product/FinalCta";
import { ProductSceneProvider } from "@/lib/three/product-scene";
import { ProductSceneLayer } from "@/components/three/ProductSceneLayer";

export default function HomePage() {
  return (
    <ProductSceneProvider>
      {/* Fixed3D layer — behind page content; stage windows are transparent */}
      <ProductSceneLayer />

      <div className="relative z-10">
        <Hero />

        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <ProductBuyBox />
        </div>

        <ModeStory />
        <Benefits />
        <Specs />
        <FinalCta />
      </div>
    </ProductSceneProvider>
  );
}
