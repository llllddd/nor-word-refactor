import { createTestPanel } from "../ui/panel/createTestPanel";
import { loadAllDictionaries } from "../core/dictionary/loadDictionary";

export function createAppController() {
  return {
    async init() {
      console.log("[Rebuild] app init");
      const dictionaries = loadAllDictionaries();

      console.log("dic loaded:", {
        main: (await dictionaries).main.length,
        myOwn: (await dictionaries).myown.length,
      });
      createTestPanel();
    },
  };
}
