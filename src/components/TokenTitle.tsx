import { useContext } from 'react'
import { TokenContext } from 'contexts/Token'

export default function TokenTitle() {
  const { selectedToken } = useContext(TokenContext)

  return <h2>{selectedToken.symbol}</h2>
}
