import { BigNumber } from "ethers";

export type LiquidityBalance = {
    tokenBalance: BigNumber,
    wethBalance: BigNumber,
}

export type MaxTradeResponse = {
    size: BigNumber,
}