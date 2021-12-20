import { Contract } from 'ethers'
import {
  ChainId,
  TEN_POW_18,
  UNI_V2_FACTORY,
  UNI_V2_PAIR_ABI,
  V2_FACTORY_ABI,
} from 'utils/constants/constants'
import { WETH } from 'utils/constants/tokens'
import { getProvider } from 'utils/provider'
import { LiquidityBalance } from './types'

export async function getUniswapV2Liquidity(
  tokenAddress: string,
  chainId: ChainId
): Promise<LiquidityBalance> {
  const provider = getProvider()
  const factoryInstance = await new Contract(
    UNI_V2_FACTORY,
    V2_FACTORY_ABI,
    provider
  )
  const pairAddress = await factoryInstance.getPair(tokenAddress, WETH)
  const pairContract = await new Contract(
    pairAddress,
    UNI_V2_PAIR_ABI,
    provider
  )
  const [tokenBalance, wethBalance] = await pairContract.getReserves()

  return {
    pairAddress,
    tokenBalance: tokenBalance.div(TEN_POW_18),
    wethBalance: wethBalance.div(TEN_POW_18),
  }
}
