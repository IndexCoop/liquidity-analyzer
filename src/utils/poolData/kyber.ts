import { BigNumber, Contract } from 'ethers'

import {
  ChainId,
  KYBER_FACTORY,
  KYBER_FACTORY_ABI,
  KYBER_FACTORY_POLYGON,
  KYBER_POOL_ABI,
  TEN_POW_18,
} from 'utils/constants/constants'

import { getProvider } from 'utils/provider'
import { getWETH } from 'utils/weth'

type KyberBalances = {
  tokenBalance: BigNumber
  wethBalance: BigNumber
}
import { LiquidityBalance } from './types'

function getFactoryAddress(chainId: ChainId) {
  switch (chainId) {
    case ChainId.ethereum:
      return KYBER_FACTORY
    case ChainId.polygon:
      return KYBER_FACTORY_POLYGON
  }
}

export async function getKyberLiquidity(
  tokenAddress: string,
  chainId: ChainId
): Promise<LiquidityBalance> {
  let response = {
    tokenBalance: BigNumber.from(0),
    wethBalance: BigNumber.from(0),
  }

  try {
    const provider = getProvider(chainId)
    const WETH = getWETH(chainId)
    const factoryAddress = getFactoryAddress(chainId)
    const factoryInstance = await new Contract(
      factoryAddress,
      KYBER_FACTORY_ABI,
      provider
    )

    const pools = await factoryInstance.getPools(tokenAddress, WETH)
    if (!pools[0]) return response

    const pairContract = await new Contract(pools[0], KYBER_POOL_ABI, provider)
    const [tokenBalance, wethBalance] = await pairContract.getReserves()

    response.tokenBalance = tokenBalance.div(TEN_POW_18)
    response.wethBalance = tokenBalance.div(wethBalance)

    return response
  } catch (error) {
    console.log('Error getting liquidity from kyber')
    console.log(error)
    return response
  }
}
