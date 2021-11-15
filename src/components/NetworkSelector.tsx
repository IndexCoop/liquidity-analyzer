import { useState } from 'react'
import styled from 'styled-components'

interface Network {
  chainId: number
  key: string
  label: string
}

// Default chain is Ethereum Mainnet
const defaultChainId = 1

// TODO: add keys and ids to constants?
const selectableNetworks: Network[] = [
  { chainId: 1, key: 'ethereum', label: 'Mainnet' },
  { chainId: 137, key: 'polygon-pos', label: 'Polygon' },
]

export default function NetworkSelector() {
  const [selectedChainId, setSelectedChainId] = useState(defaultChainId)

  const selectChain = (chainId: number) => {
    // TODO: notify provider??
    console.log(chainId)
    setSelectedChainId(chainId)
  }

  return (
    <ButtonGroup>
      {selectableNetworks.map((network) => {
        return (
          <NetworkButtonToggle
            key={network.key}
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
