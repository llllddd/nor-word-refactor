// This is the main schedule center to build the extension
import { createTestPanel } from "../ui/panel/createTestPanel";
import { loadAllDictionaries } from "../core/dictionary/loadDictionary";
import { normalizeDictionaryEntry } from "../core/text/normalizeDictEntry";
import { parseCustomEntryJson } from "../core/text/parseCustomEntryJson";
import { mergeCustomEntries } from "../core/text/mergeCustomEntries";

export function createAppController() {
  return {
    async init() {
      console.log("[Rebuild] app init");
      const dictionaries = loadAllDictionaries();

      const mainDict = (await dictionaries).main
        .map((item) => normalizeDictionaryEntry(item))
        .filter(Boolean);
      const ownDict = (await dictionaries).myown
        .map((item) => normalizeDictionaryEntry(item))
        .filter(Boolean);

      const customInput = `
        [
          {
            "word": "stille",
            "pos": "v",
            "meaning": "放置",
            "ord": "/²stile/",
            "inflection": "",
            "level": "myown"
          },
          {
            "word": "egen",
            "pos": "adj",
            "meaning": "自己的",
            "level": "myown"
          }
        ]
      `;
      const customEntries = parseCustomEntryJson(customInput);
      const mergedMyOwn = [...ownDict];
      const addedCount = mergeCustomEntries(mergedMyOwn, customEntries);
      console.log("dic loaded:", {
        main: (await dictionaries).main.length,
        myOwn: (await dictionaries).myown.length,
      });
      console.log('[Rebuild] dictionaries loaded', {
        main:mainDict.length,
        mergedMyOwn: mergedMyOwn.length,
        addedCount
      })

      createTestPanel();
    },
  };
}
