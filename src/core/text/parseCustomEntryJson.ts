import { normalizeDictionaryEntry } from "./normalizeDictEntry"
import type { DictionaryEntry } from "../dictionary/types"

export function parseCustomEntryJson(rawJson:string): DictionaryEntry[]{
    let parsed : unknown

    try{
        parsed = JSON.parse(rawJson)
    }catch(error){
        throw new Error('Json format error')
    }
    const list = Array.isArray(parsed)? parsed : [parsed]
    const normalizedEntries = list
        .map((item)=>normalizeDictionaryEntry(item))
        .filter((item): item is DictionaryEntry =>item !== null)
    if (normalizedEntries.length == 0) {
        console.warn('no valid words in the dictionary json')
    }
    return normalizedEntries

}