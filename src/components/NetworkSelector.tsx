import { useState } from 'react'
import styled from 'styled-components'

import { ChainId } from '../utils/constants/constants'

interface Network {
  chainId: number
  label: string
}

const selectableNetworks: Network[] = [
  { chainId: ChainId.ethereum, label: 'Mainnet' },
  { chainId: ChainId.polygon, label: 'Polygon' },
]

interface NetworkSelectorProps {
  didSelectNetwork: (chainId: ChainId) => void
}

export default function NetworkSelector(props: NetworkSelectorProps) {
  const [selectedChainId, setSelectedChainId] = useState(ChainId.ethereum)

  const selectChain = (chainId: ChainId) => {
    props.didSelectNetwork(chainId)
    setSelectedChainId(chainId)
  }

  return (
    <ButtonGroup>
      {selectableNetworks.map((network) => {
        return (
          <NetworkButtonToggle
            key={network.chainId}
            active={network.chainId === selectedChainId}
            onClick={() => selectChain(network.chainId)}
          >
            {network.label}
          </NetworkButtonToggle>
        )
      })}
    </ButtonGroup>
  )
}

const ButtonGroup = styled.div`
  display: flex;
  margin-left: 32px;
`

const NetworkButton = styled.button`
  background: rgba(100, 100, 200, 0.2);
  border: 0px;
  border-radius: 20px;
  color: #333;
  cursor: pointer;
  font-size: 16px;
  padding: 10px 16px;
  margin: 0 2px;
`

const NetworkButtonToggle = styled(NetworkButton)<{ active: boolean }>`
  background: #fff;
  ${({ active }) =>
    active &&
    `
    background: rgba(100, 100, 200, 0.2);
  `}
`
