import { BigDecimal } from "./bigdecimal.ts";
import { JSONRPC } from "./jsonrpc.ts";
import { Token } from "./token.ts";

const cloudflare = new JSONRPC("https://cloudflare-eth.com");
const BNB = new Token(cloudflare, "0xB8c77482e45F1F44dE1745F52C74426C631bDD52");

const binance10 = "0x85b931a32a0725be14285b66f1a22178c672d69b";

const symbol = await BNB.symbol();
const decimals = await BNB.decimals();
const supply = await BNB.totalSupply();
const balance = await BNB.balanceOf(binance10);

console.log("symbol", symbol);
console.log("decimals", decimals);
console.log("supply", Number(new BigDecimal(supply, decimals)));
console.log("balance", Number(new BigDecimal(balance, decimals)));
