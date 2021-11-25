import { JsonRpcProvider } from "@ethersproject/providers";
import { BigNumber, ethers } from "ethers";
import { LiquidityBalance, MaxTradeResponse } from "./types";

const mainNet = "https://api.0x.org";
const pricePath = "swap/v1/price";

type ZeroExQuote = {
    price: string,
    gas: string,
    value: string,
    buyAmount: string,
}

/**
 * As a dex aggregator, it has no inherent sources of liquidity.
 */
export async function getZeroExLiquidity(tokenAddress: string): Promise<LiquidityBalance> {
    return {
        tokenBalance: BigNumber.from(0),
        wethBalance: BigNumber.from(0),
    }
}

/**
 * @param tokenAddress
 * @param maxSlippagePercent 0.5% -> 0.005
 * @returns 
 */
export async function getZeroExQuote(tokenAddress: string, maxSlippagePercent: number): Promise<MaxTradeResponse> {
    const requestUrl = `${mainNet}/${pricePath}?`
        + `sellToken=WETH&`
        + `buyToken=${tokenAddress}&`
        + `sellAmount=10000000&`
        + `slippagePercentage=${maxSlippagePercent / 100}`;

    const res = await fetch(requestUrl);
    if (!res.ok) {
        throw new Error('Failed to retrieve quote')
    }
    const body: ZeroExQuote = await res.json();
    console.log(body);
    return {
        size: BigNumber.from(body.value),
    }
}