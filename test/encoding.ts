import * as ethabi from "../mod.ts";

import ERC20 from "./ERC20.ts";

try {
  const transfer = ERC20.function("transfer");
  if (!transfer) throw new Error("No transfer function");

  const address = "0x39dfd20386F5d17eBa42763606B8c704FcDd1c1D";
  const params = [address, 10000000000n];
  console.log(params);

  const encoded = ethabi.call(transfer, params);
  console.log(encoded);

  const decoded = ethabi.uncall(transfer, encoded);
  console.log(decoded);
} catch (e: unknown) {
  console.error(e);
}

console.log("Gracefully ended");
