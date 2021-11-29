import { useContext } from 'react'

import { MarketDataContext } from 'contexts/MarketData'

const useBedIndexComponents = () => {
  return { ...useContext(MarketDataContext) }
}

export default useBedIndexComponents
