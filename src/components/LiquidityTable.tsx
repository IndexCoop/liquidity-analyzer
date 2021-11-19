import { BigNumber } from 'ethers'
import { useEffect, useState, useContext } from 'react'
import styled from 'styled-components'
import { getCoinGeckoApi } from 'utils/constants/constants'
import { ExchangeName } from 'utils/poolData'
import ExchangeSummary from './ExchangeSummary'
import { MarketDataContext } from 'contexts/MarketData'
import {
  ChainId,
  COIN_GECKO_CHAIN_KEY,
  PRICE_DECIMALS,
  EXCHANGES,
} from 'utils/constants/constants'

const LiquidityTable = (props: { chainId: ChainId; desiredAmount: string }) => {
  const [tokenPrice, setTokenPrice] = useState<BigNumber>(BigNumber.from(0))
  const { selectedToken } = useContext(MarketDataContext)
  const [tokenPriceLoading, setTokenPriceLoading] = useState(true)
  const [prevTokenAddress, setSelectedTokenAddress] = useState('')

  const didTokenUpdate = (
    prevTokenAddresss: string,
    presTokenAddress: string
  ) => {
    if (prevTokenAddresss !== presTokenAddress) {
      setTokenPriceLoading(true)
      setSelectedTokenAddress(presTokenAddress)
    }
  }
  didTokenUpdate(prevTokenAddress, selectedToken.address)

  // get token price in USD
  useEffect(() => {
    const networkKey = COIN_GECKO_CHAIN_KEY[props.chainId]
    fetch(getCoinGeckoApi(selectedToken.address, networkKey))
      .then((response) => response.json())
      .then((response) => {
        console.log(response)
        console.log(
          '-->',
          selectedToken.address,
          response[selectedToken.address.toLowerCase()]?.usd,
          networkKey
        )
        setTokenPrice(
          BigNumber.from(
            Math.round(
              response[selectedToken.address.toLowerCase()]?.usd *
                PRICE_DECIMALS
            )
          )
        )
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setTokenPriceLoading(false)
      })
  }, [selectedToken.address, props.chainId])

  const renderExchangeSummary = (
    isLoading: boolean,
    tokenPriceLoaded: BigNumber,
    exchange: ExchangeName,
    chainId: ChainId
  ) => {
    return isLoading ? (
      <div key={exchange}></div>
    ) : (
      <ExchangeSummary
        tokenPrice={tokenPriceLoaded}
        exchange={exchange}
        key={exchange}
        desiredAmount={props.desiredAmount}
        chainId={chainId}
      ></ExchangeSummary>
    )
  }
  return (
    <DataTableContainer>
      <DataTable>
        <TableHeader>Exchange</TableHeader>
        <TableHeaderRightAlign>Pool Size</TableHeaderRightAlign>
        <TableHeaderRightAlign>
          Max Trade Size{' '}
          <TableHeaderSubText>
            {selectedToken.symbol} - (0.5% Slippage)
          </TableHeaderSubText>
        </TableHeaderRightAlign>
        <TableHeaderRightAlign>
          Max Trade Size{' '}
          <TableHeaderSubText>USD - (0.5% Slippage)</TableHeaderSubText>
        </TableHeaderRightAlign>
        <TableHeaderRightAlign>No. of Trades (0.5%) </TableHeaderRightAlign>
        <TableHeaderRightAlign>
          Max Trade Size{' '}
          <TableHeaderSubText>USD - (1% Slippage)</TableHeaderSubText>
        </TableHeaderRightAlign>
        <TableHeaderRightAlign>No. of Trades (1%) </TableHeaderRightAlign>
        {EXCHANGES.map((exchange) =>
          renderExchangeSummary(
            tokenPriceLoading,
            tokenPrice,
            exchange,
            props.chainId
          )
        )}
      </DataTable>
    </DataTableContainer>
  )
}

export default LiquidityTable

const DataTableContainer = styled.div`
  flex: 10;
`

const DataTable = styled.div`
  display: grid;
  grid-template-columns: 100px repeat(6, 185px);
  grid-row-gap: 4px;
`

const TableHeader = styled.div`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  border-bottom: 2px solid black;
`

const TableHeaderRightAlign = styled.div`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  text-align: right;
  border-bottom: 2px solid black;
`

const TableHeaderSubText = styled.div`
  margin: 0;
  font-size: 12px;
  font-weight: 300;
`
