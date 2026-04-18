/**
 * Ambient types for the Pinia character store (implementation is character.js).
 * Typed as StoreGeneric so helpers like storeToRefs accept it.
 */
import type { Pinia, StoreGeneric } from "pinia";

export declare function useCharacterStore(pinia?: Pinia): StoreGeneric;
