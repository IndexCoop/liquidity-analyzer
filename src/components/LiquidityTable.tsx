import { BigNumber } from 'ethers'
import { useEffect, useState, useContext } from 'react'
import styled from 'styled-components'
import { getCoinGeckoApi } from 'utils/constants/constants'
import ExchangeSummary from './ExchangeSummary'
import { TokenContext } from 'contexts/Token'
import { PRICE_DECIMALS, EXCHANGES } from 'utils/constants/constants'

const LiquidityTable = (props: {
  desiredAmount: string
}) => {
  const [tokenPrice, setTokenPrice] = useState<BigNumber>(BigNumber.from(0))
  const { selectedToken } = useContext(TokenContext)

  // get token price in USD
  useEffect(() => {
    fetch(getCoinGeckoApi(selectedToken.address))
      .then((response) => response.json())
      .then((response) => {
        setTokenPrice(
          BigNumber.from(
            Math.round(response[selectedToken.address]?.usd * PRICE_DECIMALS)
          )
        )
      })
      .catch((error) => console.log(error))
  }, [selectedToken.address])

  return (
    <div style={{flex: 10}}>
      <DataTable>
        <TableHeader>Exchange</TableHeader>
        <TableHeaderRightAlign>Pool Size</TableHeaderRightAlign>
        <TableHeaderRightAlign>
          Max Trade Size{' '}
          <TableHeaderSubText>{selectedToken.symbol} - (0.5% Slippage)</TableHeaderSubText>
        </TableHeaderRightAlign>
        <TableHeaderRightAlign>
          Max Trade Size{' '}
          <TableHeaderSubText>USD - (0.5% Slippage)</TableHeaderSubText>
        </TableHeaderRightAlign>
        <TableHeaderRightAlign>
          No. of Trades (0.5%){' '}
        </TableHeaderRightAlign>
        <TableHeaderRightAlign>
          Max Trade Size{' '}
          <TableHeaderSubText>USD - (1% Slippage)</TableHeaderSubText>
        </TableHeaderRightAlign>
        <TableHeaderRightAlign>
          No. of Trades (1%){' '}
        </TableHeaderRightAlign>
        {EXCHANGES.map((exchange) => (
          <ExchangeSummary
            tokenPrice={tokenPrice}
            exchange={exchange}
            key={exchange}
            desiredAmount={props.desiredAmount}
          ></ExchangeSummary>
        ))}
      </DataTable>
    </div>
  )
}

export default LiquidityTable

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
