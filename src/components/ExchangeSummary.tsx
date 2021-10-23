import { BigNumber } from 'ethers'
import usePrices from 'hooks/usePrices'
import numeral from 'numeral'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { getMaxTrade, getLiquidity, ExchangeName } from 'utils/poolData'
import { TEN_POW_18, PRICE_DECIMALS } from '../utils/constants/constants'
import CircularProgress from '@mui/material/CircularProgress'

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
  const [liquidityLoading, setLiquidityLoading] = useState(false)
  const [halfTradeLoading, setHalfTradeLoading] = useState(false)
  const [tradeLoading, setTradeLoading] = useState(false)

  useEffect(() => {
    setLiquidityLoading(true)
    getLiquidity(props.tokenAddress, props.exchange)
      .then((response) => {
        setTokenBalance(response.tokenBalance)
        setWethBalance(response.wethBalance)
      })
      .finally(() => {
        setLiquidityLoading(false)
      })
  }, [props.exchange, props.tokenAddress])

  useEffect(() => {
    setHalfTradeLoading(true)
    getMaxTrade(props.tokenAddress, HALF_PERCENT, props.exchange)
      .then((response) => {
        setHalfMaxTrade(response.size)
      })
      .finally(() => setHalfTradeLoading(false))
  }, [props.exchange, props.tokenAddress])

  useEffect(() => {
    setTradeLoading(true)
    getMaxTrade(props.tokenAddress, ONE_PERCENT, props.exchange)
      .then((response) => {
        setMaxTrade(response.size)
      })
      .finally(() => setTradeLoading(false))
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
        {liquidityLoading ? (
          <CircularProgress />
        ) : (
          <div>{numeral(totalLiquidity).format('$0,0.00')}</div>
        )}
      </TableDataRightAlign>
      <TableDataRightAlign>
        {halfTradeLoading ? (
          <CircularProgress />
        ) : (
          <div> {numeral(maxHalfTradeToken).format('0,0.00')}</div>
        )}
      </TableDataRightAlign>
      <TableDataRightAlign>
        {halfTradeLoading ? (
          <CircularProgress />
        ) : (
          <div> {numeral(maxHalfTradeUSD).format('$0,0.00')}</div>
        )}
      </TableDataRightAlign>
      <TableDataRightAlign>
        {tradeLoading ? (
          <CircularProgress />
        ) : (
          <div> {numeral(maxTradeUSD).format('$0,0.00')}</div>
        )}
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
