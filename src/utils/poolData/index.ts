// @ts-ignore
import DeployHelper from '@setprotocol/index-rebalance-utils/dist/utils/deploys/index'
import {
  getUniswapV3Quote,
  getUniswapV2Quote,
  getSushiswapQuote,
  // @ts-ignore
} from '@setprotocol/index-rebalance-utils/dist/index-rebalances/utils/paramDetermination'
import { ether } from '@setprotocol/index-coop-contracts/dist/utils/common'
import { getProvider } from '../provider'
import { BigNumber } from 'ethers'
import { getUniswapV3Liquidity } from './uniswapV3'
import { getUniswapV2Liquidity } from './uniswapV2'
import { getSushiswapLiquidity } from './sushiswap'

export { getBalancerV1Liquidity } from './balancerV1'

export { getKyberLiquidity } from './kyber'

export { getSushiswapLiquidity } from './sushiswap'

interface MaxTradeResponse {
  size: BigNumber
}

export type ExchangeName = 'UniswapV3' | 'UniswapV2' | 'Sushiswap'

const exchangeUtilsMapping = {
  UniswapV3: {
    maxTradeGetter: getUniswapV3Quote,
    liquidityGetter: getUniswapV3Liquidity,
  },
  UniswapV2: {
    maxTradeGetter: getUniswapV2Quote,
    liquidityGetter: getUniswapV2Liquidity,
  },
  Sushiswap: {
    maxTradeGetter: getSushiswapQuote,
    liquidityGetter: getSushiswapLiquidity,
  },
}

const wrappedProviderExchanges = ['UniswapV3', 'Sushiswap']

export async function getMaxTrade(
  tokenAddress: string,
  maxSlipagePercent: number,
  exchange: ExchangeName
): Promise<MaxTradeResponse> {
  let provider = getProvider()
  if (wrappedProviderExchanges.includes(exchange)) {
    provider = new DeployHelper(provider)
  }
  const { maxTradeGetter } = exchangeUtilsMapping[exchange]
  const quote = await maxTradeGetter(
    provider,
    tokenAddress,
    ether(maxSlipagePercent)
  )
  return {
    size: BigNumber.from(quote.size),
  }
}

export async function getLiquidity(
  tokenAddress: string,
  exchange: ExchangeName
) {
  return exchangeUtilsMapping[exchange].liquidityGetter(tokenAddress)
}

export { getUniswapV2Liquidity }
