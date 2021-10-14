import { ethers } from 'ethers'
import { ALCHEMY_API } from './constants/constants'

export const getProvider = () => {
  return new ethers.providers.JsonRpcProvider(ALCHEMY_API)
}
