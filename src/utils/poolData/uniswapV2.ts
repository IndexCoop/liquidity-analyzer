import { BigNumber } from 'ethers'
import { BaseProvider } from '@ethersproject/providers'
import {
  ether,
  preciseDiv,
  preciseMul,
} from '@setprotocol/index-coop-contracts/dist/utils/common'

import { ChainId, TokenAmount, Pair, Trade, Token, Fetcher } from '@uniswap/sdk'

import { ExchangeQuote, exchanges, Address } from '../types'
import { ZERO } from '../constants/constants'

const TEN_BPS_IN_PERCENT = ether(0.1)
const THIRTY_BPS_IN_PERCENT = ether(0.3)

export async function getUniswapV2Quote(
  provider: BaseProvider,
  tokenAddress: Address,
  targetPriceImpact: BigNumber
) {
  return
}
