//Define the Dictionary type
export interface DictionaryEntry{
    word:string
    type?: string
    meaning?:string
    ord?:string
    inflection?:string
    examples?:string[] | string
    level?: string
}

export type DictionaryList = DictionaryEntry[]