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
export async function getZeroExLiquidity(
  tokenAddress: string
): Promise<LiquidityBalance> {
  return {
    pairAddress: '',
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
    const baseQuote = await getQuote(tokenAddress, "WETH", 1, maxSlippagePercent);
    let maxTradeQuote;
    let slippagePercent = 0;
    let tradeAmount = 2;
    while (slippagePercent * 100 < maxSlippagePercent) {
        maxTradeQuote = await getQuote(tokenAddress, "WETH", tradeAmount, maxSlippagePercent);
        slippagePercent = (parseFloat(baseQuote.price) - parseFloat(maxTradeQuote.price)) / parseFloat(baseQuote.price);
        tradeAmount++;
    }

    return {
        size: BigNumber.from(maxTradeQuote?.buyAmount),
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
