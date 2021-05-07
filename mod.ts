export { Contract, ContractFunction, ContractConstructor } from "./pkg/ethabi.js";

import * as HEX from "https://deno.land/std@0.95.0/encoding/hex.ts";

import init, { ContractConstructor, ContractFunction } from "./pkg/ethabi.js";
import { wasm } from "./pkg/ethabi_bg.wasm.js";

await init(wasm);

/**
 * 0x-prefixed hex-encoded string
 */
export type Encoded = string

/**
 * Deploy a contract using the provided code and values
 * @param constr Constructor, use contract.constructr()
 * @param code Contract byte code
 * @param values Constructor arguments as JS values (string, bigint, number)
 * @returns hex-encoded 0x-prefixed string
 */
export function deploy(constr: ContractConstructor, code: Uint8Array, values: unknown[] = []) {
  const tokens = tokenizeAll(constr.inputs(), values)
  const bytes = constr.encode_input(code, tokens)
  return "0x" + HEX.encodeToString(bytes)
}

/**
 * Resolve original values from a deployment
 * @param constr Contract constructor
 * @param code Contract bytecode
 * @param encoded Deployment data as 0x-prefix hex-encoded string
 * @returns JS values array
 */
export function undeploy(constr: ContractConstructor, code: Uint8Array, encoded: Encoded) {
  const bytes = HEX.decodeString(encoded.slice(2))
  if (code !== bytes.slice(0, code.length))
    throw new Error("Invalid bytecode")
  const tokens = constr.decode_input(bytes.slice(code.length))
  return detokenizeAll(constr.inputs(), tokens)
}

/**
 * Call a contract function using the provided values
 * @param func Function, use contract.function(name)
 * @param values Function arguments as JS values (string, bigint, number)
 * @returns hex-encoded 0x-prefixed string
 */
export function call(func: ContractFunction, values: unknown[] = []) {
  const tokens = tokenizeAll(func.inputs(), values)
  const bytes = func.encode_input(tokens)
  return "0x" + HEX.encodeToString(bytes)
}

/**
 * Resolve originals value from a call
 * @param func Contract function
 * @param encoded Input data as a 0x-prefixed hex-encoded string
 * @returns JS values array
 */
export function uncall(func: ContractFunction, encoded: Encoded) {
  const bytes = HEX.decodeString(encoded.slice(2))
  const tokens = func.decode_input(bytes.slice(4))
  return detokenizeAll(func.inputs(), tokens)
}

/**
 * Decode function output
 * @param func Contract function
 * @param encoded Output data as a 0x-prefixed hex-encoded string
 * @returns JS values array
 */
export function decode(func: ContractFunction, encoded: Encoded) {
  const bytes = HEX.decodeString(encoded.slice(2))
  const tokens = func.decode_output(bytes)
  return detokenizeAll(func.outputs(), tokens)
}

/**
 * Transform any JS value to a string, according to the type
 * WARNING: does not yet support tuple and structs
 * @param types Tokens types
 * @param values Tokens values
 * @returns string array
 */
export function tokenizeAll(types: string[], values: unknown[]) {
  return values.map((value, i) => tokenize(types[i], value));
}

/**
 * Transform any JS value to a string, according to the type
 * WARNING: does not yet support tuple and structs
 * @param inputs Token types
 * @param values JS values
 * @returns string
 */
export function tokenize(type: string, value: unknown) {
  if (type === "address") {
    if (typeof value === "string")
      return value.slice(2)
  }

  if (/^uint[0-9]+$/.test(type)) {
    if (typeof value === "bigint")
      if (value >= 0) return String(value);
    if (typeof value === "number" && Number.isSafeInteger(value))
      if (value >= 0) return String(value);
  }

  if (/^int[0-9]+$/.test(type)) {
    if (typeof value === "bigint")
      return String(value);
    if (typeof value === "number" && Number.isSafeInteger(value))
      return String(value);
  }

  if (type === "string") {
    if (typeof value === "string")
      return value
  }

  throw new Error(`Unable to tokenize ${value} for ${type}`)
}

/**
 * Transform a string token to a JS value, according to the type
 * WARNING: does not yet support tuple and structs
 * @param types Tokens types
 * @param tokens Tokens values
 * @returns JS values array
 */
export function detokenizeAll(types: string[], tokens: string[]) {
  return tokens.map((token, i) => detokenize(types[i], token));
}

/**
 * Transform a string token to a JS value, according to the type
 * WARNING: does not yet support tuple and structs
 * @param types Token type
 * @param tokens Token value
 * @returns JS value
 */
export function detokenize(type: string, token: string) {
  if (type === "string")
    return token

  if (type === "address")
    return "0x" + token

  if (/^uint[0-9]+$/.test(type)) {
    const size = Number(type.slice("uint".length))

    if (size < 64)
      return Number("0x" + token)
    else
      return BigInt("0x" + token)
  }

  if (/^int[0-9]+$/.test(type)) {
    const size = Number(type.slice("int".length))

    if (size < 64)
      return Number("0x" + token)
    else
      return BigInt("0x" + token)
  }

  throw new Error(`Unable to detokenize ${token} for ${type}`)
}