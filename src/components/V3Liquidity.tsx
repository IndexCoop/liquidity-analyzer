import { BigNumber } from 'ethers'
import usePrices from 'hooks/usePrices'
import { useEffect, useState } from 'react'
import { getUniswapV3Liquidity } from 'utils/poolData'

const V3Liquidity = (props: {
  tokenAddress: string
  tokenPrice: BigNumber
}) => {
  const [tokenBalance, setTokenBalance] = useState<BigNumber>(BigNumber.from(0))
  const [wethBalance, setWethBalance] = useState<BigNumber>(BigNumber.from(0))
  const { ethereumPrice } = usePrices()

  useEffect(() => {
    getUniswapV3Liquidity(props.tokenAddress).then((response) => {
      setTokenBalance(response.tokenBalance)
      setWethBalance(response.wethBalance)
    })
  }, [props.tokenAddress])

  const tokenTotal = props.tokenPrice.mul(tokenBalance)
  const wethTotal = ethereumPrice.mul(wethBalance)
  const totalLiquidity = tokenTotal.add(wethTotal)

  return (
    <div>
      Uniswap V3 Liquidity: ${totalLiquidity.toNumber().toLocaleString()}
    </div>
  )
}

export default V3Liquidity
