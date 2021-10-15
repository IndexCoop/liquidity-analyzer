import { BigNumber } from 'ethers'
import usePrices from 'hooks/usePrices'
import { useEffect, useState } from 'react'
import { getUniswapV3Liquidity } from 'utils/poolData'

const TotalLiquidity = (props: { tokenAddress: string; tokenAbi: any }) => {
  const [tokenBalance, setTokenBalance] = useState<BigNumber>(BigNumber.from(0))
  const [wethBalance, setWethBalance] = useState<BigNumber>(BigNumber.from(0))

  const { yfiPrice, ethereumPrice } = usePrices()

  useEffect(() => {
    getUniswapV3Liquidity(props.tokenAddress, props.tokenAbi).then(
      (response) => {
        setTokenBalance(response.tokenBalance)
        setWethBalance(response.wethBalance)
      }
    )
  }, [props.tokenAbi, props.tokenAddress])

  const tokenTotal = yfiPrice.mul(tokenBalance)
  const wethTotal = ethereumPrice.mul(wethBalance)
  const totalLiquidity = tokenTotal.add(wethTotal)

  return <div>{totalLiquidity.toString()}</div>
}

export default TotalLiquidity
