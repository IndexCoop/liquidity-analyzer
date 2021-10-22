import { BigNumber } from 'ethers'
import { useEffect, useState } from 'react'
import { getCoinGeckoApi } from 'utils/constants/constants'
import BalancerLiquidity from './BalancerLiquidity'
import KyberLiquidity from './KyberLiquidity'
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

  return (
    <div>
      <ExchangeSummary
        tokenAddress={props.tokenAddress}
        tokenPrice={tokenPrice}
        exchange="UniswapV3"
      ></ExchangeSummary>
      <ExchangeSummary
        tokenAddress={props.tokenAddress}
        tokenPrice={tokenPrice}
        exchange="UniswapV2"
      ></ExchangeSummary>
      <ExchangeSummary
        tokenAddress={props.tokenAddress}
        tokenPrice={tokenPrice}
        exchange="Sushiswap"
      ></ExchangeSummary>
      <KyberLiquidity
        tokenAddress={props.tokenAddress}
        tokenPrice={tokenPrice}
      ></KyberLiquidity>
      <BalancerLiquidity
        tokenAddress={props.tokenAddress}
        tokenPrice={tokenPrice}
      ></BalancerLiquidity>
    </div>
  )
}

export default LiquidityTable
