import { BigNumber, ethers } from 'ethers'

import { ChainId } from '@uniswap/sdk'

import {
  ether,
  preciseDiv,
  preciseMul,
} from '@setprotocol/index-coop-contracts/dist/utils/common'

import {
  Fetcher as kyberFetcher,
  Pair as kyberPair,
  Token as kyberToken,
  TokenAmount as kyberTokenAmount,
  Trade as kyberTrade,
} from '@dynamic-amm/sdk'

import { ALCHEMY_API } from '../constants/constants'
import { ExchangeQuote, exchanges, Address } from '../types'
import { getProvider } from '../provider'

const KYBER_FACTORY = '0x833e4083B7ae46CeA85695c4f7ed25CDAd8886dE'

export async function getKyberDMMQuote(
  tokenAddress: Address,
  targetPriceImpact: BigNumber
) {
  const provider = getProvider()

  return
}
