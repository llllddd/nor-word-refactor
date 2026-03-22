//Define the Dictionary type
export interface DictionaryEntry{
    word:string,
    type?: string,
    pos?: string,
    meaning?:string,
    ord?:string,
    inflection?:string,
    description?:string,
    examples?:string[] | string,
    level?: string
}

export type DictionaryList = DictionaryEntry[]