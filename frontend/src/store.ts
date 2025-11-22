import { create } from "zustand";
import type { Guide } from "./interfaces";

type GuideListStore = {
  guides: Array<Guide>;
  addGuide: (guide: Guide) => void;
  initializeGuides: (guides: Array<Guide>) => void;
};

const useGuideListStore = create<GuideListStore>((set) => ({
  guides: [],
  addGuide: (guide: Guide) =>
    set((state) => ({
      guides: [...state.guides, guide],
    })),
  initializeGuides: (guides: Array<Guide>) =>
    set(() => ({
      guides: guides,
    })),
}));

export { useGuideListStore };
