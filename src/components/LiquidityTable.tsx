import { BigNumber } from 'ethers'
import { useEffect, useState, useContext } from 'react'
import styled from 'styled-components'
import { getCoinGeckoApi } from 'utils/constants/constants'
import { ExchangeName } from 'utils/poolData'
import ExchangeSummary from './ExchangeSummary'
import { TokenContext } from 'contexts/Token'
import { PRICE_DECIMALS } from 'utils/constants/constants'


const LiquidityTable = () => {
  const [tokenPrice, setTokenPrice] = useState<BigNumber>(BigNumber.from(0))
  const { selectedToken } = useContext(TokenContext)

  // get token price in USD
  useEffect(() => {
    fetch(getCoinGeckoApi(selectedToken.address))
      .then((response) => response.json())
      .then((response) => {
        console.log("Setting token price to ", response[selectedToken.address]?.usd)
        setTokenPrice(BigNumber.from(Math.round(response[selectedToken.address]?.usd*PRICE_DECIMALS)))
      })
      .catch((error) => console.log(error))
  }, [selectedToken.address])

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
            tokenAddress={selectedToken.address}
            tokenPrice={tokenPrice}
            exchange={exchange}
            key={exchange}
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
