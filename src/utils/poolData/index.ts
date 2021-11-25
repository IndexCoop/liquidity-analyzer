// @ts-ignore
import DeployHelper from '@setprotocol/index-rebalance-utils/dist/utils/deploys/index'
import {
  getUniswapV3Quote,
  getUniswapV2Quote,
  getSushiswapQuote,
  getKyberDMMQuote,
  getBalancerV1Quote,
  // @ts-ignore
} from '@setprotocol/index-rebalance-utils/dist/index-rebalances/utils/paramDetermination'
import { ether } from '@setprotocol/index-coop-contracts/dist/utils/common'
import { getProvider } from '../provider'
import { BigNumber } from 'ethers'
import { getUniswapV3Liquidity } from './uniswapV3'
import { getUniswapV2Liquidity } from './uniswapV2'
import { getSushiswapLiquidity } from './sushiswap'
import { getBalancerV1Liquidity } from './balancerV1'
import { getKyberLiquidity } from './kyber'
import { ChainId } from '../../utils/constants/constants'

interface MaxTradeResponse {
  size: BigNumber
}
import { getZeroExLiquidity, getZeroExQuote } from './zeroEx'
import { MaxTradeResponse } from './types'

export type ExchangeName =
  | 'UniswapV3'
  | 'UniswapV2'
  | 'Sushiswap'
  | 'Kyber'
  | 'Balancer'
  | 'ZeroEx'

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
  Kyber: {
    maxTradeGetter: getKyberDMMQuote,
    liquidityGetter: getKyberLiquidity,
  },
  Balancer: {
    maxTradeGetter: getBalancerV1Quote,
    liquidityGetter: getBalancerV1Liquidity,
  },
}

const wrappedProviderExchanges = ['UniswapV3', 'Sushiswap']

export async function getMaxTrade(
  tokenAddress: string,
  maxSlippagePercent: number,
  exchange: ExchangeName,
  chainId: ChainId
): Promise<MaxTradeResponse> {
  if (exchange === 'ZeroEx') {
    return await getZeroExQuote(tokenAddress, maxSlippagePercent)
  }
  let provider = getProvider()
  if (wrappedProviderExchanges.includes(exchange)) {
    provider = new DeployHelper(provider)
  }
  const { maxTradeGetter } = exchangeUtilsMapping[exchange]
  const quote = await maxTradeGetter(
    provider,
    tokenAddress,
    ether(maxSlippagePercent),
    chainId
  )
  return {
    size: BigNumber.from(quote.size),
  }
}

export async function getLiquidity(
  tokenAddress: string,
  exchange: ExchangeName,
  chainId: ChainId
) {
  if (exchange === 'ZeroEx') {
    return getZeroExLiquidity(tokenAddress);
  }
  return exchangeUtilsMapping[exchange].liquidityGetter(tokenAddress, chainId)
}

export { getUniswapV2Liquidity }
