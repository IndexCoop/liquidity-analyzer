import { BigNumber } from 'ethers'

import { ChainId, CurrencyAmount, Pair, Token, Trade } from '@sushiswap/sdk'

import {
  ether,
  preciseDiv,
  preciseMul,
} from '@setprotocol/index-coop-contracts/dist/utils/common'

import { ExchangeQuote, exchanges, Address } from '../types'

const TEN_BPS_IN_PERCENT = ether(0.1)
const THIRTY_BPS_IN_PERCENT = ether(0.3)

const SUSHI_FACTORY = '0xc0aee478e3658e2610c5f7a4a2e1777ce9e4f2ac'

export async function getSushiswapQuote(
  tokenAddress: Address,
  targetPriceImpact: BigNumber
) {
  return
}
