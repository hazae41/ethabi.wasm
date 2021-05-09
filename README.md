# (WIP) ethabi.wasm

WebAssembly powered Ethereum ABI encoder/decoder for Deno, written in Rust.

Uses https://github.com/rust-ethereum/ethabi under the hood.

## Features

- Only does the ABI encoding/decoding, you can use your own RPC lib
- Compatible with (almost) any WASM-compliant JS runtime (Deno, Node, browser)
- Gracefully exits when given wrong values

## Usage

    deno cache -r https://deno.land/x/ethabi/mod.ts

```typescript
import * as ethabi from "https://deno.land/x/ethabi/mod.ts";

const ERC20 = await ethabi.load("ERC20.json", import.meta.url);

// Call function "transfer" with address and uint256
const transfer = ERC20.function("transfer")!;
const myaddress = "0x39dfd20386F5d17eBa42763606B8c704FcDd1c1D";
const called = ethabi.call(transfer, [myaddress, 10000000000n]);
// -> hex-encoded 0x-prefixed string

// Deploy contract with bytecode and uint256
const code = new Uint8Array(/* your bytecode */);
const constructr = ERC20.constructr()!;
const deployed = ethabi.deploy(constructr, code, [10000n]);
// -> hex-encoded 0x-prefixed string
```

## Test

    deno cache -r https://deno.land/x/ethabi/test/encoding.ts
    deno run --allow-net https://deno.land/x/ethabi/test/encoding.ts

    deno cache -r https://deno.land/x/ethabi/examples/tokens/mod.ts
    deno run --allow-net https://deno.land/x/ethabi/examples/tokens/mod.ts

## Current features

- Function input encoding/decoding
- Function output decoding
- Constructor encoding/decoding
- Tokenization of simple types:
  - JS string <-> Solidity string
  - JS string <-> Solitidy address
  - JS bigint <-> Solidity (u)int
  - JS number <-> Solidity (u)int

## Building (using Deno)

- Install wasm-pack

      cargo install wasm-pack

- Generate WASM

      wasm-pack build --target web --release

- Pack .wasm to .wasm.js

      deno run -A build.ts
