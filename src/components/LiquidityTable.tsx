import { BigNumber } from 'ethers'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { getCoinGeckoApi } from 'utils/constants/constants'
import { ExchangeName } from 'utils/poolData'
import ExchangeSummary from './ExchangeSummary'

const LiquidityTable = (props: { tokenAddress: string }) => {
  const [tokenPrice, setTokenPrice] = useState<BigNumber>(BigNumber.from(0))

  // get token price in USD
  useEffect(() => {
    fetch(getCoinGeckoApi(props.tokenAddress))
      .then((response) => response.json())
      .then((response) => {
        setTokenPrice(BigNumber.from(response[props.tokenAddress]?.usd))
      })
      .catch((error) => console.log(error))
  }, [props.tokenAddress])

  const exchanges: Array<ExchangeName> = [
    'UniswapV3',
    'UniswapV2',
    'Sushiswap',
    'Kyber',
    'Balancer',
  ]

  return (
    <div>
      <DataTable>
        <TableHeader>Exchange</TableHeader>
        <TableHeaderRightAlign>Pool Size</TableHeaderRightAlign>
        <TableHeaderRightAlign>
          Max Trade Size{' '}
          <TableHeaderSubText>(0.5% Slippage)</TableHeaderSubText>
        </TableHeaderRightAlign>
        <TableHeaderRightAlign>
          Max Trade Size <TableHeaderSubText>(1% Slippage)</TableHeaderSubText>
        </TableHeaderRightAlign>
        {exchanges.map((exchange, index) => (
          <ExchangeSummary
            tokenAddress={props.tokenAddress}
            tokenPrice={tokenPrice}
            exchange={exchange}
          ></ExchangeSummary>
        ))}
      </DataTable>
    </div>
  )
}

export default LiquidityTable

const DataTable = styled.div`
  display: grid;
  grid-template-columns: 100px repeat(3, 165px);
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
