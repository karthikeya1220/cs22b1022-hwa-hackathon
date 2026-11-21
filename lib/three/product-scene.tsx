"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { FinishId } from "@/lib/product";

export type ProductMode = "idle" | "lick" | "roll" | "puzzle";
export type StageId = "hero" | "buy" | "modes";

type ProductSceneState = {
  finishId: FinishId;
  mode: ProductMode;
  activeStage: StageId | null;
  webglOk: boolean;
  setFinishId: (id: FinishId) => void;
  setMode: (mode: ProductMode) => void;
  setActiveStage: (id: StageId | null) => void;
  setWebglOk: (ok: boolean) => void;
};

const ProductSceneContext = createContext<ProductSceneState | null>(null);

export function ProductSceneProvider({ children }: { children: ReactNode }) {
  const [finishId, setFinishId] = useState<FinishId>("clay");
  const [mode, setMode] = useState<ProductMode>("idle");
  const [activeStage, setActiveStage] = useState<StageId | null>(null);
  const [webglOk, setWebglOk] = useState(true);

  const value = useMemo(
    () => ({
      finishId,
      mode,
      activeStage,
      webglOk,
      setFinishId,
      setMode,
      setActiveStage,
      setWebglOk,
    }),
    [finishId, mode, activeStage, webglOk],
  );

  return (
    <ProductSceneContext.Provider value={value}>
      {children}
    </ProductSceneContext.Provider>
  );
}

export function useProductScene() {
  const ctx = useContext(ProductSceneContext);
  if (!ctx) {
    throw new Error("useProductScene must be used within ProductSceneProvider");
  }
  return ctx;
}
