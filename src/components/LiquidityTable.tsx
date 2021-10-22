import { BigNumber } from 'ethers'
import { useEffect, useState } from 'react'
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
      {exchanges.map((exchange, index) => (
        <ExchangeSummary
          tokenAddress={props.tokenAddress}
          tokenPrice={tokenPrice}
          exchange={exchange}
        ></ExchangeSummary>
      ))}
    </div>
  )
}

export default LiquidityTable
