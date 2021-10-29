import { BigNumber, Contract } from 'ethers'

import {
  KYBER_FACTORY,
  KYBER_FACTORY_ABI,
  KYBER_POOL_ABI,
} from 'utils/constants/constants'
import { ERC20_ABI, WETH } from 'utils/constants/tokens'
import { getProvider } from 'utils/provider'
import { tenToThe } from '.'

type KyberBalances = {
  tokenBalance: BigNumber
  wethBalance: BigNumber
}

export async function getKyberLiquidity(
  tokenAddress: string
): Promise<KyberBalances> {
  let response: KyberBalances = {
    tokenBalance: BigNumber.from(0),
    wethBalance: BigNumber.from(0),
  }
  const provider = getProvider()
  const tokenContract = await new Contract(tokenAddress, ERC20_ABI, provider)
  const factoryInstance = await new Contract(
    KYBER_FACTORY,
    KYBER_FACTORY_ABI,
    provider
  )

  const pools = await factoryInstance.getPools(tokenAddress, WETH)
  if (!pools[0]) return response

  const pairContract = await new Contract(pools[0], KYBER_POOL_ABI, provider)
  const [tokenBalance, wethBalance] = await pairContract.getReserves()

  response.tokenBalance = tokenBalance.div(
    tenToThe(await tokenContract.decimals())
  )
  response.wethBalance = wethBalance.div(tenToThe(18))

  return response
}
