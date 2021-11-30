import { BigNumber, constants } from "ethers";
import { ZERO } from "utils/constants/constants";
import { LiquidityBalance, MaxTradeResponse } from "./types";

const mainNet = "https://api.0x.org";
const pricePath = "swap/v1/price";
const swapPath = "swap/v1/quote";

type ZeroExQuote = {
    price: string,
    guaranteedPrice: string,
    buyAmount: string,
    buyTokenToEthRate: string,
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
    if (maxSlippagePercent <= 0) {
        throw new Error('Invalid max slippage percent')
    }
    const quote1 = await getQuote(tokenAddress, "WETH", 1, maxSlippagePercent);
    let quote2;
    let slippagePercent = 0;
    let inputAmount = 2;
    while (slippagePercent * 100 < maxSlippagePercent) {
        quote2 = await getQuote(tokenAddress, "WETH", inputAmount, maxSlippagePercent);
        slippagePercent = (parseFloat(quote1.price) - parseFloat(quote2.price)) / parseFloat(quote1.price);
        inputAmount++;
    }

    return {
        size: BigNumber.from(quote2?.buyAmount),
    }
}

async function getQuote(buyToken: string, sellToken: string, sellAmount: number, slippagePercent: number): Promise<ZeroExQuote> {
    const requestUrl = `${mainNet}/${swapPath}?`
        + `sellToken=${sellToken}&`
        + `sellAmount=${constants.WeiPerEther.mul(sellAmount)}&`
        + `buyToken=${buyToken}&`
        + `slippagePercentage=${slippagePercent / 100}`;
    const res = await fetch(requestUrl);
    if (!res.ok) {
        throw new Error('Failed to retrieve quote')
    }
    return await res.json();
}
