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

const reducer = (previousValue: BigNumber, currentValue: BigNumber) =>
  previousValue.add(currentValue)

// Usage note, targetPriceImpact should be the impact including fees! Balancer pool fees can change and it's not easy to extract from the data
// we have so put in a number that is net of fees.
async function getBalancerV1(tokenAddress: string, chainId: ChainId) {
  let response: LiquidityBalance = {
    pairAddress: '',
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

  response = {
    pairAddress: pools[0],
    tokenBalance: tokenBalances.reduce(reducer).div(TEN_POW_18),
    wethBalance: wethBalances.reduce(reducer).div(TEN_POW_18),
  }

  return response
}

async function getBalancerV2(tokenAddress: string, chainId: ChainId) {
  let response: LiquidityBalance = {
    pairAddress: '',
    tokenBalance: BigNumber.from(0),
    wethBalance: BigNumber.from(0),
  }
  const WETH = getWETH(chainId)
  const tokenList = [tokenAddress, WETH]
  const query = `
        query {
          pools(where: {tokensList_contains: [${tokenList.map(
            (val) => `"${val}"`
          )}]}) {
            address
            tokensList
            tokens {
              address
              balance
            }
          }
        }`

  try {
    const result = await fetch(
      `https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-polygon-v2`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      }
    )

    const json = await result.json()
    const pools = json.data.pools

    if (pools === undefined || pools.length < 1) {
      console.log('Balancer: no pool found for pair')
      return response
    }

    let poolAddresses: string[] = []
    let tokenBalances: BigNumber[] = []
    let wethBalances: BigNumber[] = []

    const pairPools = pools.filter((pool: any) => {
      return pool.tokensList.length === 2
    })

    pairPools.map((pool: any) => {
      const token = pool.tokens.filter(
        (token: any) =>
          token.address.toLowerCase() === tokenAddress.toLowerCase()
      )
      const weth = pool.tokens.filter(
        (token: any) => token.address.toLowerCase() === WETH.toLowerCase()
      )
      if (token.length < 1 || weth.length < 1) {
        tokenBalances.push(BigNumber.from(0))
        wethBalances.push(BigNumber.from(0))
      } else {
        const tokenBalance = parseInt(token[0].balance)
        const wethBalance = parseInt(weth[0].balance)
        poolAddresses.push(pool.address)
        tokenBalances.push(BigNumber.from(tokenBalance))
        wethBalances.push(BigNumber.from(wethBalance))
      }
    })

    response = {
      pairAddress: poolAddresses[0],
      tokenBalance: tokenBalances.reduce(reducer),
      wethBalance: wethBalances.reduce(reducer),
    }

    return response
  } catch (error) {
    console.log('Error fetching balancer graph API')
    console.log(error)
    return response
  }
}

export async function getBalancerV1Liquidity(
  tokenAddress: string,
  chainId: ChainId
): Promise<LiquidityBalance> {
  switch (chainId) {
    case ChainId.ethereum:
      return await getBalancerV1(tokenAddress, chainId)
    case ChainId.polygon:
      return await getBalancerV2(tokenAddress, chainId)
  }
}
