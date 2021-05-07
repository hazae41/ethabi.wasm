# (WIP) ethabi.wasm

WebAssembly powered Ethereum ABI encoder/decoder for Deno and Node, written in Rust.

Uses https://github.com/rust-ethereum/ethabi under the hood.

## Features

- Only does the ABI encoding/decoding, you can use your own RPC lib
- Compatible with (almost) any WASM-compliant JS runtime (Deno, Node, browser)
- Gracefully exits when given wrong values

## Usage

    deno cache -r https://deno.land/x/ethabi/mod.ts

```typescript
import { Contract, call, deploy } from "https://deno.land/x/ethabi/mod.ts";

const ERC20url = new URL("ERC20.json", import.meta.url);
const ERC20 = JSON.parse(Deno.readTextFileSync(ERC20url));

const contract = new Contract(ERC20);

// Call function "transfer" with address and uint256
const transfer = contract.function("transfer")!;
const myaddress = "0x39dfd20386F5d17eBa42763606B8c704FcDd1c1D";
const encoded = call(transfer, myaddress, 10000000000n);
// -> hex-encoded 0x-prefixed string

// Deploy contract with bytecode and uint256
const code = new UInt8Array(/* your bytecode */);
const constructr = contract.constructr()!;
const encoded = deploy(constructr, code, 10000n);
// -> hex-encoded 0x-prefixed string
```

## Test

    deno cache -r https://deno.land/x/ethabi/test/token.ts
    deno run --allow-net https://deno.land/x/ethabi/test/token.ts

## Building (using Deno)

- Install wasm-pack

      cargo install wasm-pack

- Generate WASM

      wasm-pack build --target web --release

- Pack .wasm to .wasm.js

      deno run -A build.ts
