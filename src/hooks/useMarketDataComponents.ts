import { useContext } from 'react'

import { MarketDataContext } from 'contexts/MarketData'

const useMarketDataComponents = () => {
  return { ...useContext(MarketDataContext) }
}

export default useMarketDataComponents
