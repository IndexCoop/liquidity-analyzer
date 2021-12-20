import { BigNumber } from 'ethers'

export type LiquidityBalance = {
  pairAddress: string
  tokenBalance: BigNumber
  wethBalance: BigNumber
}

export type MaxTradeResponse = {
  size: BigNumber
}
