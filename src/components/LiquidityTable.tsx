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
        <TableHeader>Total Liquidity</TableHeader>
        <TableHeader>Max Trade Size</TableHeader>
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
  grid-template-columns: repeat(3, 165px);
  grid-row-gap: 4px;
`

const TableHeader = styled.div`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  border-bottom: 2px solid black;
`
