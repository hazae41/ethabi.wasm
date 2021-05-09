import * as ethabi from "../mod.ts";

try {
  const ERC20 = await ethabi.load("ERC20.json", import.meta.url);

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
