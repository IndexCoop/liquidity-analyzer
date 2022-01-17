import { createContext } from 'react'
import { BigNumber } from 'ethers'
import IndexComponent from 'components/IndexComponent'
import { TokenData } from './types'

interface MarketDataProps {
  bedComponent?: IndexComponent[]
  dataComponent?: IndexComponent[]
  dpiComponent?: IndexComponent[]
  mviComponent?: IndexComponent[]
  gmiComponent?: IndexComponent[]
  ethereumPrice: BigNumber
  selectedToken: TokenData
  setSelectedToken: React.Dispatch<React.SetStateAction<TokenData>>
}

export const defaultToken: TokenData = {
  chainId: 1,
  address: '0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e',
  name: 'yearn finance',
  symbol: 'YFI',
  decimals: 18,
  logoURI:
    'https://assets.coingecko.com/coins/images/11849/thumb/yfi-192x192.png?1598325330',
}

const MarketData = createContext<MarketDataProps>({
  ethereumPrice: BigNumber.from(0),
  selectedToken: defaultToken,
  setSelectedToken: () => null,
})

export default MarketData
