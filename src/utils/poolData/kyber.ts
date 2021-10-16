import { BigNumber, Contract } from 'ethers'

import {
  KYBER_FACTORY,
  KYBER_FACTORY_ABI,
  KYBER_POOL_ABI,
  TEN_POW_18,
} from 'utils/constants/constants'
import { WETH_ADDRESS } from 'utils/constants/tokens'
import { getProvider } from 'utils/provider'

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
  const factoryInstance = await new Contract(
    KYBER_FACTORY,
    KYBER_FACTORY_ABI,
    provider
  )

  const pools = await factoryInstance.getPools(tokenAddress, WETH_ADDRESS)
  if (!pools[0]) return response

  const pairContract = await new Contract(pools[0], KYBER_POOL_ABI, provider)
  const [tokenBalance, wethBalance] = await pairContract.getReserves()

  response.tokenBalance = tokenBalance.div(TEN_POW_18)
  response.wethBalance = tokenBalance.div(wethBalance)

  return response
}
