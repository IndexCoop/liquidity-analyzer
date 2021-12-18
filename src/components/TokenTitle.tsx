import styled from 'styled-components'
import { useContext } from 'react'
import { MarketDataContext } from 'contexts/MarketData'
import { ChainId } from '../utils/constants/constants'
import { getBlockExplorerUrl } from '../utils/block-explorer'

interface TokenTitleProps {
  chainId: ChainId
}

export default function TokenTitle(props: TokenTitleProps) {
  const { selectedToken } = useContext(MarketDataContext)
  const explorerUrl = getBlockExplorerUrl(selectedToken.address, props.chainId)

  return (
    <div>
      <h2 style={{ marginBottom: 0 }}>{selectedToken.symbol}</h2>
      <Address>
        <a
          href={explorerUrl}
          style={{ color: 'gray' }}
          target='_blank'
          rel='noreferrer'
        >
          {selectedToken.address.substr(0, 8)}...
        </a>
      </Address>
    </div>
  )
}

const Address = styled.h3`
  font-size: 12px;
  margin-top: 0;
  padding: 0;
`
