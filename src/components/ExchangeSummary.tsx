import { BigNumber } from 'ethers'
import usePrices from 'hooks/usePrices'
import { useEffect, useState } from 'react'
import { getMaxTrade, getLiquidity, ExchangeName } from 'utils/poolData'
import { TEN_POW_18 } from '../utils/constants/constants'

const MAXIMUM_SLIPPAGE_PERCENT = 0.5

const ExchangeSummary = (props: {
  tokenAddress: string
  tokenPrice: BigNumber
  exchange: ExchangeName
}) => {
  const [tokenBalance, setTokenBalance] = useState<BigNumber>(BigNumber.from(0))
  const [wethBalance, setWethBalance] = useState<BigNumber>(BigNumber.from(0))
  const [maxTrade, setMaxTrade] = useState<BigNumber>(BigNumber.from(0))
  const { ethereumPrice } = usePrices()

  useEffect(() => {
    getLiquidity(props.tokenAddress, props.exchange).then((response) => {
      setTokenBalance(response.tokenBalance)
      setWethBalance(response.wethBalance)
    })
  }, [props.tokenAddress])

  useEffect(() => {
    getMaxTrade(props.tokenAddress, MAXIMUM_SLIPPAGE_PERCENT, props.exchange).then(
      (response) => {
        setMaxTrade(response.size)
      }
    )
  }, [props.tokenAddress])

  const tokenTotal = props.tokenPrice.mul(tokenBalance)
  const wethTotal = ethereumPrice.mul(wethBalance)
  const totalLiquidity = tokenTotal.add(wethTotal)
  const maxTradeTotal = props.tokenPrice.mul(maxTrade).div(TEN_POW_18)

  return (
    <div>
      <div>
        {props.exchange} Liquidity: ${totalLiquidity.toNumber().toLocaleString()}
      </div>
      <div>
        {props.exchange} MaxTrade: ${maxTradeTotal.toNumber().toLocaleString()}
      </div>
    </div>
  )
}

export default ExchangeSummary
