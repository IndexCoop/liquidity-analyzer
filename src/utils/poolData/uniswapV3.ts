import { FeeAmount } from '@uniswap/v3-sdk'
import { Contract, BigNumber } from 'ethers'
import { abi as V3_FACTORY_ABI } from '@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json'

import { ADDRESS_ZERO, ChainId, TEN_POW_18 } from '../constants/constants'
import { getProvider } from '../provider'
import { WETH, ERC20_ABI } from 'utils/constants/tokens'
import { LiquidityBalance } from './types'

const UNI_V3_FACTORY = '0x1F98431c8aD98523631AE4a59f267346ea31F984'

export async function getUniswapV3Liquidity(
  tokenAddress: string,
  chainId: ChainId
): Promise<LiquidityBalance> {
  const provider = getProvider()
  const factoryInstance = await new Contract(
    UNI_V3_FACTORY,
    V3_FACTORY_ABI,
    provider
  )
  const poolAddress = await factoryInstance.getPool(
    tokenAddress,
    WETH,
    FeeAmount.MEDIUM
  )

  if (poolAddress === ADDRESS_ZERO) console.log('poolAddress === ADDRESS_ZERO')

  const tokenContract = await new Contract(tokenAddress, ERC20_ABI, provider)
  const wethContract = await new Contract(WETH, ERC20_ABI, provider)

  const tokenBalance: BigNumber = await tokenContract.balanceOf(poolAddress)
  const wethBalance: BigNumber = await wethContract.balanceOf(poolAddress)
  return {
    tokenBalance: tokenBalance.div(TEN_POW_18),
    wethBalance: wethBalance.div(TEN_POW_18),
  }
}
