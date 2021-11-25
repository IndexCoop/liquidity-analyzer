import { useContext } from 'react'
import { MarketDataContext } from 'contexts/MarketData'

export default function TokenTitle() {
  const { selectedToken } = useContext(MarketDataContext)

  return <h2>{selectedToken.symbol}</h2>
}
