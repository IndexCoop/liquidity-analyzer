import { BigNumber, Contract } from 'ethers'
import { BigNumber as BigNumberJS } from 'bignumber.js'

import {
  BALANCER_OCR,
  BALANCER_OCR_ABI,
  TEN_POW_18,
} from '../constants/constants'
import { getProvider } from 'utils/provider'
import { WETH_ABI, WETH_ADDRESS } from 'utils/constants/tokens'

type BalBalances = {
  tokenBalance: BigNumber
  wethBalance: BigNumber
}

// Usage note, targetPriceImpact should be the impact including fees! Balancer pool fees can change and it's not easy to extract from the data
// we have so put in a number that is net of fees.
export async function getBalancerV1Liquidity(
  tokenAddress: string,
  tokenAbi: any
): Promise<BalBalances> {
  let response: BalBalances = {
    tokenBalance: BigNumber.from(0),
    wethBalance: BigNumber.from(0),
  }
  let tokenBalances: BigNumber[] = []
  let wethBalances: BigNumber[] = []
  const provider = getProvider()
  const ocr = await new Contract(BALANCER_OCR, BALANCER_OCR_ABI, provider)
  const tokenContract = await new Contract(tokenAddress, tokenAbi, provider)
  const wethContract = await new Contract(WETH_ADDRESS, WETH_ABI, provider)
  const pools: string[] = await ocr.getBestPools(WETH_ADDRESS, tokenAddress)

  if (pools.length < 1) return response

  await Promise.all(
    pools.map(async (pool) => {
      tokenBalances.push(await tokenContract.balanceOf(pool))
      wethBalances.push(await wethContract.balanceOf(pool))
    })
  )

  const reducer = (previousValue: BigNumber, currentValue: BigNumber) =>
    previousValue.add(currentValue)
  response = {
    tokenBalance: tokenBalances.reduce(reducer).div(TEN_POW_18),
    wethBalance: wethBalances.reduce(reducer).div(TEN_POW_18),
  }

  return response
}
