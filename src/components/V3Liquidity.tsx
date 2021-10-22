import { BigNumber } from 'ethers'
import usePrices from 'hooks/usePrices'
import { useEffect, useState } from 'react'
import { getUniswapV3Liquidity, getUniswapV3MaxTrade } from 'utils/poolData'
import { TEN_POW_18 } from '../utils/constants/constants'

const V3Liquidity = (props: { tokenAddress: string; tokenAbi: any }) => {
  const [tokenBalance, setTokenBalance] = useState<BigNumber>(BigNumber.from(0))
  const [wethBalance, setWethBalance] = useState<BigNumber>(BigNumber.from(0))
  const [maxTrade, setMaxTrade] = useState<BigNumber>(BigNumber.from(0))

  const { yfiPrice, ethereumPrice } = usePrices()

  useEffect(() => {
    getUniswapV3Liquidity(props.tokenAddress, props.tokenAbi).then(
      (response) => {
        setTokenBalance(response.tokenBalance)
        setWethBalance(response.wethBalance)
      }
    )
  }, [props.tokenAbi, props.tokenAddress])

  useEffect(() => {
    getUniswapV3MaxTrade(props.tokenAddress).then((response) => {
      setMaxTrade(response.size)
    })
  }, [props.tokenAbi, props.tokenAddress])

  const tokenTotal = yfiPrice.mul(tokenBalance)
  const wethTotal = ethereumPrice.mul(wethBalance)
  const totalLiquidity = tokenTotal.add(wethTotal)
  const maxTradeTotal = yfiPrice.mul(maxTrade).div(TEN_POW_18)

  return (
    <div>
      <div>
        Uniswap V3 Liquidity: ${totalLiquidity.toNumber().toLocaleString()}
      </div>
      <div>
        Uniswap V3 MaxTrade: ${maxTradeTotal.toNumber().toLocaleString()}
      </div>
    </div>
  )
}

export default V3Liquidity
