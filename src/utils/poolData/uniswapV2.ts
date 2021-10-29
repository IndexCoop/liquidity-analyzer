import { BigNumber, Contract } from 'ethers'
import {
  UNI_V2_FACTORY,
  UNI_V2_PAIR_ABI,
  V2_FACTORY_ABI,
} from 'utils/constants/constants'

import { ERC20_ABI, WETH } from 'utils/constants/tokens'
import { getProvider } from 'utils/provider'
import { tenToThe } from '.'

type V2Balances = {
  tokenBalance: BigNumber
  wethBalance: BigNumber
}

export async function getUniswapV2Liquidity(
  tokenAddress: string
): Promise<V2Balances> {
  const provider = getProvider()
  const tokenContract = await new Contract(tokenAddress, ERC20_ABI, provider)
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

  const response: V2Balances = {
    tokenBalance: tokenBalance.div(tenToThe(await tokenContract.decimals())),
    wethBalance: wethBalance.div(tenToThe(18)),
  }
  return response
}
