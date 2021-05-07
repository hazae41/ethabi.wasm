import { call, Contract, decode } from "../mod.ts";

const ERC20url = new URL("ERC20.json", import.meta.url)
const ERC20 = JSON.parse(Deno.readTextFileSync(ERC20url));

class JSONRPC {
  private id = 1;

  constructor(
    readonly url: string
  ) { }

  private async request(method: string, ...params: unknown[]) {
    const res = await fetch(this.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: this.id++,
        method: method,
        params: params
      })
    })

    if (!res.ok) throw new Error(res.statusText)
    const { error, result } = await res.json()
    if (error) throw new Error(error.message)
    return result
  }

  async call(options: {
    from?: string,
    to: string,
    data: string
  }) {
    return await this.request("eth_call", {
      from: options.from,
      to: options.to,
      data: options.data
    }, "pending")
  }
}

class Token {
  readonly contract = new Contract(ERC20)

  constructor(
    readonly jsonrpc: JSONRPC,
    readonly address: string
  ) { }

  async symbol() {
    const func = this.contract.function("symbol")!

    const output = await this.jsonrpc
      .call({ data: call(func), to: this.address })
    const [result] = decode(func, output)

    return result as string
  }

  async decimals() {
    const func = this.contract.function("decimals")!

    const output = await this.jsonrpc
      .call({ data: call(func), to: this.address })
    const [result] = decode(func, output)

    return result as number
  }

  async totalSupply() {
    const func = this.contract.function("totalSupply")!

    const output = await this.jsonrpc
      .call({ data: call(func), to: this.address })
    const [result] = decode(func, output)

    return result as bigint
  }

  async balanceOf(address: string) {
    const func = this.contract.function("balanceOf")!
    const input = call(func, [address])

    const output = await this.jsonrpc
      .call({ data: input, to: this.address })
    const [result] = decode(func, output)

    return result as bigint
  }
}

class BigDecimal {
  constructor(
    readonly value: bigint,
    readonly decimals: number
  ) { }

  static from(number: number, decimals: number) {
    const [int, decimal] = String(number).split(".");
    const pdecimal = (decimal ?? "").padEnd(decimals, "0")
    return new this(BigInt(int + pdecimal), decimals)
  }

  toString() {
    const string = String(this.value).padStart(this.decimals + 1, "0")
    return string.slice(0, -this.decimals) + "." + string.slice(-this.decimals)
  }

  toNumber() {
    return Number(this.toString())
  }
}

const BNB = new Token(
  new JSONRPC("https://cloudflare-eth.com"),
  "0xB8c77482e45F1F44dE1745F52C74426C631bDD52"
)

const symbol = await BNB.symbol()
const decimals = await BNB.decimals()
const supply = await BNB.totalSupply()
const balance = await BNB.balanceOf("0x85b931a32a0725be14285b66f1a22178c672d69b")

console.log("symbol", symbol)
console.log("decimals", decimals)
console.log("supply", Number(new BigDecimal(supply, decimals)))
console.log("balance", Number(new BigDecimal(balance, decimals)))