import { BLOCK_EXPLORER, ChainId } from './constants/constants'

export const getBlockExplorerUrl = (
  address: string,
  chainId: ChainId = ChainId.ethereum
) => {
  return BLOCK_EXPLORER[chainId] + address
}
