import { ChainId } from './constants/constants'
import { WETH, WETH_POLYGON } from './constants/tokens'

export const getWETH = (chainId: ChainId = ChainId.ethereum) => {
  switch (chainId) {
    case ChainId.ethereum:
      return WETH
    case ChainId.polygon:
      return WETH_POLYGON
  }
}
