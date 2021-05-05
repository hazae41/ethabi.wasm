/* tslint:disable */
/* eslint-disable */
/**
*/
export class Contract {
  free(): void;
/**
* @param {any} json
*/
  constructor(json: any);
/**
* @param {string} name
* @returns {ContractFunction | undefined}
*/
  function(name: string): ContractFunction | undefined;
/**
* @returns {ContractConstructor | undefined}
*/
  constructr(): ContractConstructor | undefined;
/**
* @param {string} name
* @returns {ContractEvent | undefined}
*/
  event(name: string): ContractEvent | undefined;
}
/**
*/
export class ContractConstructor {
  free(): void;
/**
* @returns {any[]}
*/
  inputs(): any[];
/**
* @param {Uint8Array} code
* @param {any[]} values
* @returns {Uint8Array}
*/
  encode(code: Uint8Array, values: any[]): Uint8Array;
}
/**
*/
export class ContractEvent {
  free(): void;
}
/**
*/
export class ContractFunction {
  free(): void;
/**
* @returns {any[]}
*/
  inputs(): any[];
/**
* @param {any[]} values
* @returns {Uint8Array}
*/
  encode(values: any[]): Uint8Array;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_contract_free: (a: number) => void;
  readonly contract_new: (a: number) => number;
  readonly contract_function: (a: number, b: number, c: number) => number;
  readonly contract_constructr: (a: number) => number;
  readonly contract_event: (a: number, b: number, c: number) => number;
  readonly __wbg_contractconstructor_free: (a: number) => void;
  readonly contractconstructor_inputs: (a: number, b: number) => void;
  readonly contractconstructor_encode: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly __wbg_contractfunction_free: (a: number) => void;
  readonly contractfunction_inputs: (a: number, b: number) => void;
  readonly contractfunction_encode: (a: number, b: number, c: number, d: number) => void;
  readonly __wbg_contractevent_free: (a: number) => void;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number) => void;
}

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
