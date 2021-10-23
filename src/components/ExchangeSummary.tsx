import { BigNumber } from 'ethers'
import usePrices from 'hooks/usePrices'
import numeral from 'numeral'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { getMaxTrade, getLiquidity, ExchangeName } from 'utils/poolData'
import { TEN_POW_18, PRICE_DECIMALS } from '../utils/constants/constants'

const HALF_PERCENT = 0.5
const ONE_PERCENT = 1

const ExchangeSummary = (props: {
  tokenAddress: string
  tokenPrice: BigNumber
  exchange: ExchangeName
}) => {
  const [tokenBalance, setTokenBalance] = useState<BigNumber>(BigNumber.from(0))
  const [wethBalance, setWethBalance] = useState<BigNumber>(BigNumber.from(0))
  const [maxTrade, setMaxTrade] = useState<BigNumber>(BigNumber.from(0))
  const [maxHalfTrade, setHalfMaxTrade] = useState<BigNumber>(BigNumber.from(0))
  const { ethereumPrice } = usePrices()

  useEffect(() => {
    getLiquidity(props.tokenAddress, props.exchange).then((response) => {
      setTokenBalance(response.tokenBalance)
      setWethBalance(response.wethBalance)
    })
  }, [props.exchange, props.tokenAddress])

  useEffect(() => {
    getMaxTrade(props.tokenAddress, HALF_PERCENT, props.exchange).then(
      (response) => {
        setHalfMaxTrade(response.size)
      }
    )
    getMaxTrade(props.tokenAddress, ONE_PERCENT, props.exchange).then(
      (response) => {
        setMaxTrade(response.size)
      }
    )
  }, [props.exchange, props.tokenAddress])

  const tokenTotal =
    props.tokenPrice.mul(tokenBalance).toNumber() / PRICE_DECIMALS
  const wethTotal = ethereumPrice.mul(wethBalance).toNumber() / PRICE_DECIMALS
  const totalLiquidity = tokenTotal + wethTotal
  const maxHalfTradeToken =
    maxHalfTrade.mul(PRICE_DECIMALS).div(TEN_POW_18).toNumber() / PRICE_DECIMALS
  const maxHalfTradeUSD =
    props.tokenPrice.mul(maxHalfTrade).div(TEN_POW_18).toNumber() /
    PRICE_DECIMALS
  const maxTradeUSD =
    props.tokenPrice.mul(maxTrade).div(TEN_POW_18).toNumber() / PRICE_DECIMALS

  return (
    <>
      <TableData>{props.exchange}</TableData>
      <TableDataRightAlign>
        {numeral(totalLiquidity).format('$0,0.00')}
      </TableDataRightAlign>
      <TableDataRightAlign>
        {numeral(maxHalfTradeToken).format('0,0.00')}
      </TableDataRightAlign>
      <TableDataRightAlign>
        {numeral(maxHalfTradeUSD).format('$0,0.00')}
      </TableDataRightAlign>
      <TableDataRightAlign>
        {numeral(maxTradeUSD).format('$0,0.00')}
      </TableDataRightAlign>
    </>
  )
}

export default ExchangeSummary

const TableHeader = styled.div`
  margin: 0;
  font-size: 12px;
`

const TableData = styled(TableHeader)`
  font-size: 16px;
  line-height: 24px;
  border-bottom: 1px solid gray;
`

const TableDataRightAlign = styled(TableHeader)`
  font-size: 16px;
  line-height: 24px;
  text-align: right;
  border-bottom: 1px solid gray;
`
