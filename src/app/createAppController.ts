// This is the main schedule center to build the extension
import { createTestPanel } from "../ui/panel/createTestPanel";
import { loadAllDictionaries } from "../core/dictionary/loadDictionary";
import { normalizeDictionaryEntry } from "../core/text/normalizeDictEntry";
import { parseCustomEntryJson } from "../core/text/parseCustomEntryJson";
import { mergeCustomEntries } from "../core/text/mergeCustomEntries";
import { buildMatcher } from "../core/matcher/buildMatcher";
import { findMatches } from "../core/matcher/findMatches";

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
            "type": "v",
            "meaning": "放置",
            "ord": "/²stile/",
            "inflection": "",
            "level": "myown"
          },
          {
            "word": "egen",
            "type": "adj",
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
      console.log("[Rebuild] dictionaries loaded", {
        main: mainDict.length,
        mergedMyOwn: mergedMyOwn.length,
        addedCount,
      });

      const matcher = buildMatcher(mainDict);
      const sampleText = "Hei! Jeg har en bok. Hun stilte stolen der.";
      const matches = findMatches(sampleText, matcher);
      console.log("matches are:", matches);

      if (import.meta.env.MODE === "debug") {
        const debugGlobal = globalThis as typeof globalThis & {
          __nhDebug?: {
            matcher: ReturnType<typeof buildMatcher>;
            mainDict: typeof mainDict;
            mergedMyOwn: typeof mergedMyOwn;
            matches: typeof matches;
          };
        };
        debugGlobal.__nhDebug = {
          matcher,
          mainDict,
          mergedMyOwn,
          matches,
        };
        console.log("[Rebuild] debug handle: window.__nhDebug");
      }

      createTestPanel();
    },
  };
}
