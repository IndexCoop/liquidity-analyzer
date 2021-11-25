import { BigNumber, Contract } from 'ethers'

import {
  BALANCER_OCR,
  BALANCER_OCR_ABI,
  BALANCER_V2_POLYGON,
  ChainId,
  TEN_POW_18,
} from 'utils/constants/constants'
import { getProvider } from 'utils/provider'
import { ERC20_ABI } from 'utils/constants/tokens'
import { getWETH } from 'utils/weth'
import { LiquidityBalance } from './types'

function getFactoryAddress(chainId: ChainId) {
  switch (chainId) {
    case ChainId.ethereum:
      return BALANCER_OCR
    case ChainId.polygon:
      return BALANCER_V2_POLYGON
  }
}

// Usage note, targetPriceImpact should be the impact including fees! Balancer pool fees can change and it's not easy to extract from the data
// we have so put in a number that is net of fees.
async function getBalancerV1(tokenAddress: string, chainId: ChainId) {
  let response: BalBalances = {
    tokenBalance: BigNumber.from(0),
    wethBalance: BigNumber.from(0),
  }

  let tokenBalances: BigNumber[] = []
  let wethBalances: BigNumber[] = []
  const provider = getProvider()
  const WETH = getWETH(chainId)
  const factoryAddress = getFactoryAddress(chainId)
  const ocr = await new Contract(factoryAddress, BALANCER_OCR_ABI, provider)
  const tokenContract = await new Contract(tokenAddress, ERC20_ABI, provider)
  const wethContract = await new Contract(WETH, ERC20_ABI, provider)
  const pools: string[] = await ocr.getBestPools(WETH, tokenAddress)

  if (pools.length < 1) return response

  await Promise.all(
    pools.map(async (pool) => {
      tokenBalances.push(await tokenContract.balanceOf(pool))
      wethBalances.push(await wethContract.balanceOf(pool))
    })
  )

  const reducer = (previousValue: BigNumber, currentValue: BigNumber) =>
    previousValue.add(currentValue)
  return {
    tokenBalance: tokenBalances.reduce(reducer).div(TEN_POW_18),
    wethBalance: wethBalances.reduce(reducer).div(TEN_POW_18),
  }
}

async function getBalancerV2(tokenAddress: string, chainId: ChainId) {
  let response: BalBalances = {
    tokenBalance: BigNumber.from(0),
    wethBalance: BigNumber.from(0),
  }

  // TODO: add balancer v2 factory abi

  // TODO: fetch pool id for pair (via subgraph)
  // https://dev.balancer.fi/resources/pool-interfacing#poolids
  // https://thegraph.com/hosted-service/subgraph/balancer-labs/balancer-v2

  // TODO: use vault.getPoolTokens() to obtain balances
  // https://dev.balancer.fi/resources/pool-interfacing#pool-balances

  return response
}

export async function getBalancerV1Liquidity(
  tokenAddress: string,
  chainId: ChainId
): Promise<BalBalances> {
  switch (chainId) {
    case ChainId.ethereum:
      return getBalancerV1(tokenAddress, chainId)
    case ChainId.polygon:
      return getBalancerV2(tokenAddress, chainId)
  }
}
