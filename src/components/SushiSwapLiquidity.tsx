import { BigNumber } from 'ethers'
import usePrices from 'hooks/usePrices'
import { useEffect, useState } from 'react'
import { getSushiswapLiquidity } from 'utils/poolData'

const SushiSwapLiquidity = (props: { tokenAddress: string }) => {
  const [tokenBalance, setTokenBalance] = useState<BigNumber>(BigNumber.from(0))
  const [wethBalance, setWethBalance] = useState<BigNumber>(BigNumber.from(0))

  const { yfiPrice, ethereumPrice } = usePrices()

  useEffect(() => {
    getSushiswapLiquidity(props.tokenAddress).then((response) => {
      setTokenBalance(response.tokenBalance)
      setWethBalance(response.wethBalance)
    })
  }, [props.tokenAddress])

  const tokenTotal = yfiPrice.mul(tokenBalance)
  const wethTotal = ethereumPrice.mul(wethBalance)
  const totalLiquidity = tokenTotal.add(wethTotal)

  return (
    <div>
      Sushiswap Liquidity: ${totalLiquidity.toNumber().toLocaleString()}
    </div>
  )
}

export default SushiSwapLiquidity