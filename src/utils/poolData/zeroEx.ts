import { BigNumber, constants } from "ethers";
import { ZERO } from "utils/constants/constants";
import { LiquidityBalance, MaxTradeResponse } from "./types";

const mainNet = "https://api.0x.org";
const pricePath = "swap/v1/price";

type ZeroExQuote = {
    price: string,
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
    let slippage = 0;
    let quote = await getQuote(tokenAddress, "WETH", 1, maxSlippagePercent);;
    // let sellAmount = 1;
    // while (slippage < maxSlippagePercent) {
    //     quote = await getQuote(tokenAddress, "WETH", sellAmount, maxSlippagePercent);
    //     slippage = (parseFloat(quote.buyTokenToEthRate) - parseFloat(quote.price)) / parseFloat(quote.buyTokenToEthRate);
    //     sellAmount += 10;
    //     await new Promise(f => setTimeout(f, 10000));
    // }
    // if (quote == null) {
    //     throw new Error('No quote retrieved');
    // }

    if (BigNumber.from(quote.buyAmount).eq(0)) {
        return {
            size: BigNumber.from(constants.Zero),
        }
    }
    return {
        size: BigNumber.from(quote.buyAmount),
    }
}

async function getQuote(buyToken: string, sellToken: string, sellAmount: number, slippagePercent: number): Promise<ZeroExQuote> {
    const requestUrl = `${mainNet}/${pricePath}?`
        + `sellToken=${sellToken}&`
        + `sellAmount=${constants.WeiPerEther.mul(sellAmount)}&`
        + `buyToken=${buyToken}&`
        + `slippagePercentage=${slippagePercent / 100}`;
    console.log(requestUrl);
    const res = await fetch(requestUrl);
    if (!res.ok) {
        throw new Error('Failed to retrieve quote')
    }
    return await res.json();
}
