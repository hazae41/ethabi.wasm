import { call, Contract } from "../mod.ts";

const ERC20url = new URL("ERC20.json", import.meta.url)
const ERC20 = JSON.parse(Deno.readTextFileSync(ERC20url));

try {
  const contract = new Contract(ERC20);
  const transfer = contract.function("transfer")
  if (!transfer) throw new Error("No transfer function")

  const address = "0x39dfd20386F5d17eBa42763606B8c704FcDd1c1D";
  const encoded = call(transfer, address, 10000000000n)
  console.log(encoded)
} catch (e: unknown) {
  console.error(e);
}

console.log("Gracefully ended");
