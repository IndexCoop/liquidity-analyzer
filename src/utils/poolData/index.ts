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
import { FeeAmount } from '@uniswap/v3-sdk'
import { ether } from '@setprotocol/index-coop-contracts/dist/utils/common'
import { getProvider } from '../provider'
import { BigNumber } from 'ethers'
import { getUniswapV3LiquidityFeeLow,getUniswapV3LiquidityFeeMedium,getUniswapV3LiquidityFeeHigh } from './uniswapV3'
import { getUniswapV2Liquidity } from './uniswapV2'
import { getSushiswapLiquidity } from './sushiswap'
import { getBalancerV1Liquidity } from './balancerV1'
import { getKyberLiquidity } from './kyber'
import { ChainId } from '../../utils/constants/constants'
import { getZeroExLiquidity, getZeroExQuote } from './zeroEx'
import { MaxTradeResponse } from './types'
import { chain } from 'lodash'


export type ExchangeName =
  | 'UniswapV3FeeLow'
  | 'UniswapV3FeeMedium'
  | 'UniswapV3FeeHigh'
  | 'UniswapV2'
  | 'Sushiswap'
  | 'Kyber'
  | 'Balancer'
  | 'ZeroEx'

const exchangeUtilsMapping = {
  UniswapV3FeeLow: {
    maxTradeGetter: getUniswapV3FeeLowQuote,
    liquidityGetter: getUniswapV3LiquidityFeeLow,
  },
  UniswapV3FeeMedium:{
    maxTradeGetter: getUniswapV3FeeMediumQuote,
    liquidityGetter: getUniswapV3LiquidityFeeMedium,
  },
  UniswapV3FeeHigh: {
    maxTradeGetter: getUniswapV3FeeHighQuote,
    liquidityGetter: getUniswapV3LiquidityFeeHigh,
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

const wrappedProviderExchanges = ['UniswapV3FeeLow','UniswapV3FeeMedium','UniswapV3FeeHigh', 'Sushiswap']

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

  const  quote = await maxTradeGetter(
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


function getUniswapV3FeeLowQuote( deployHelper: DeployHelper, token: String, targetPriceImpact: BigNumber, chainId: ChainId) {
  return getUniswapV3Quote(deployHelper,token,targetPriceImpact,chainId,FeeAmount.LOW)
}

function getUniswapV3FeeMediumQuote( deployHelper: DeployHelper, token: String, targetPriceImpact: BigNumber, chainId: ChainId) {
  return getUniswapV3Quote(deployHelper,token,targetPriceImpact,chainId,FeeAmount.MEDIUM)
}

function getUniswapV3FeeHighQuote( deployHelper: DeployHelper, token: String, targetPriceImpact: BigNumber, chainId: ChainId) {
  return getUniswapV3Quote(deployHelper,token,targetPriceImpact,chainId,FeeAmount.HIGH)
}