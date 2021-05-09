import * as ethabi from "../../mod.ts";
import { JSONRPC } from "./jsonrpc.ts";

const ERC20 = await ethabi.load("abi/ERC20.json", import.meta.url);

export class Token {
  constructor(
    readonly jsonrpc: JSONRPC,
    readonly address: string,
  ) {}

  private async call<T extends unknown[]>(
    name: string,
    params: unknown[] = [],
  ): Promise<T> {
    const func = ERC20.function(name)!;
    const input = ethabi.call(func, params);
    const output = await this.jsonrpc
      .call({ data: input, to: this.address });
    return ethabi.decode(func, output) as T;
  }

  async symbol() {
    const [symbol] = await this.call<[string]>("symbol");
    return symbol;
  }

  async decimals() {
    const [decimals] = await this.call<[number]>("decimals");
    return decimals;
  }

  async totalSupply() {
    const [totalSupply] = await this.call<[bigint]>("totalSupply");
    return totalSupply;
  }

  async balanceOf(address: string) {
    const [balance] = await this.call<[bigint]>("balanceOf", [address]);
    return balance;
  }
}
