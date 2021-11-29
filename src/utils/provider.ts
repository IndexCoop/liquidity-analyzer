import { ethers } from 'ethers'
import { ALCHEMY_API, ChainId } from './constants/constants'

export const getProvider = (chainId: ChainId = ChainId.ethereum) => {
  return new ethers.providers.JsonRpcProvider(ALCHEMY_API[chainId])
}
