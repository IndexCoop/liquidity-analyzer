import { BigNumber, Contract } from 'ethers'
import {
  ADDRESS_ZERO,
  ChainId,
  TEN_POW_18,
  SUSHI_FACTORY,
  SUSHI_FACTORY_POLYGON,
  UNI_V2_PAIR_ABI,
  V2_FACTORY_ABI,
} from 'utils/constants/constants'
import { getProvider } from 'utils/provider'
import { getWETH } from 'utils/weth'
import { LiquidityBalance } from './types'

function getFactoryAddress(chainId: ChainId) {
  switch (chainId) {
    case ChainId.ethereum:
      return SUSHI_FACTORY
    case ChainId.polygon:
      return SUSHI_FACTORY_POLYGON
  }
}

export async function getSushiswapLiquidity(
  tokenAddress: string,
  chainId: ChainId
): Promise<LiquidityBalance> {
  let response = {
    pairAddress: '',
    tokenBalance: BigNumber.from(0),
    wethBalance: BigNumber.from(0),
  }
  try {
    const provider = getProvider(chainId)
    const WETH = getWETH(chainId)
    const factoryAddress = getFactoryAddress(chainId)
    const factoryInstance = await new Contract(
      factoryAddress,
      V2_FACTORY_ABI,
      provider
    )
    const pairAddress = await factoryInstance.getPair(tokenAddress, WETH)
    if (pairAddress === ADDRESS_ZERO) {
      throw new Error('Error getting address for pair on SushiSwap')
    }
    const pairContract = await new Contract(
      pairAddress,
      UNI_V2_PAIR_ABI,
      provider
    )

    const [tokenBalance, wethBalance] = await pairContract.getReserves()

    // For some reason for polygon the tokens returned seem to be switched up
    response = {
      pairAddress,
      tokenBalance:
        chainId === ChainId.polygon
          ? wethBalance.div(TEN_POW_18)
          : tokenBalance.div(TEN_POW_18),
      wethBalance:
        chainId === ChainId.polygon
          ? tokenBalance.div(TEN_POW_18)
          : wethBalance.div(TEN_POW_18),
    }
  } catch (error) {
    console.log('Error getting liquidity from SushiSwap')
    console.log(error)
  }
  return response
}
