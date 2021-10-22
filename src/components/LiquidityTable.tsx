import { BigNumber } from 'ethers'
import { useEffect, useState } from 'react'
import { getCoinGeckoApi } from 'utils/constants/constants'
import BalancerLiquidity from './BalancerLiquidity'
import KyberLiquidity from './KyberLiquidity'
import SushiSwapLiquidity from './SushiSwapLiquidity'
import V2Liquidity from './V2Liquidity'
import V3Liquidity from './V3Liquidity'

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
      <V3Liquidity
        tokenAddress={props.tokenAddress}
        tokenPrice={tokenPrice}
      ></V3Liquidity>
      <V2Liquidity
        tokenAddress={props.tokenAddress}
        tokenPrice={tokenPrice}
      ></V2Liquidity>
      <SushiSwapLiquidity
        tokenAddress={props.tokenAddress}
        tokenPrice={tokenPrice}
      ></SushiSwapLiquidity>
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
