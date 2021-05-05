export { Contract, ContractFunction, ContractConstructor } from "./pkg/ethabi.js";

import * as HEX from "https://deno.land/std@0.95.0/encoding/hex.ts";

import init, { ContractConstructor, ContractFunction } from "./pkg/ethabi.js";
import { wasm } from "./pkg/ethabi_bg.wasm.js";

await init(wasm);

/**
 * Deploy a contract using the provided code and values
 * @param constr Constructor, use contract.constructr()
 * @param code Contract byte code
 * @param values Constructor arguments as JS values (string, bigint, number)
 * @returns hex-encoded 0x-prefixed string
 */
export function deploy(constr: ContractConstructor, code: Uint8Array, ...values: any[]) {
  const tokens = tokenize(constr.inputs(), values)
  return "0x" + HEX.encodeToString(constr.encode(code, tokens))
}

/**
 * Call a contract function using the provided values
 * @param func Function, use contract.function(name)
 * @param values Function arguments as JS values (string, bigint, number)
 * @returns hex-encoded 0x-prefixed string
 */
export function call(func: ContractFunction, ...values: any[]) {
  const tokens = tokenize(func.inputs(), values)
  return "0x" + HEX.encodeToString(func.encode(tokens))
}

/**
 * Transform any JS value to a string, according to the input type
 * WARNING: does not yet support tuple and structs
 * @param inputs Input types of the constructor/function to deploy/call
 * @param values Arguments as JS values (string, bigint, number)
 * @returns string array
 */
export function tokenize(inputs: string[], values: any[]) {
  return values.map((value, i) => {
    const input = inputs[i]

    if (input === "address") {
      if (typeof value === "string")
        return value.slice(2)
    }

    if (/^uint[0-9]+$/.test(input)) {
      if (typeof value === "bigint")
        if (value >= 0) return String(value);
      if (typeof value === "number" && Number.isSafeInteger(value))
        if (value >= 0) return String(value);
    }

    if (/^int[0-9]+$/.test(input)) {
      if (typeof value === "bigint")
        return String(value);
      if (typeof value === "number" && Number.isSafeInteger(value))
        return String(value);
    }

    if (input === "string") {
      if (typeof value === "string")
        return value
    }

    throw new Error(`Unable to tokenize ${value} for ${input}`)
  });
}
