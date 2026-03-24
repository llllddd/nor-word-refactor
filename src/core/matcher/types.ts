import type { NormalizedExample } from "../text/normalizeExamples";

export interface MatchedEntry {
  meaning: string;
  type: string;
  inflection: string;
  baseWord: string;
  ord: string;
  examples: NormalizedExample[];
  level: string;
}

export interface FirstTokenMap {
  byLength: Map<number, Map<string, MatchedEntry>>;
  lengthsDesc: number[];
}

export interface Matcher {
  index: Map<string, FirstTokenMap>;
  size: number;
}

export interface TextMatch extends MatchedEntry {
  start: number;
  end: number;
}
