import { BigNumber } from 'ethers'
import usePrices from 'hooks/usePrices'
import numeral from 'numeral'
import { useEffect, useState, useContext } from 'react'
import styled from 'styled-components'
import { getMaxTrade, getLiquidity, ExchangeName } from 'utils/poolData'
import { PRICE_DECIMALS, TEN_POW_18 } from '../utils/constants/constants'
import CircularProgress from '@mui/material/CircularProgress'
import { TokenContext } from 'contexts/Token'

const HALF_PERCENT = 0.5
const ONE_PERCENT = 1

const getIsUniV3 = (exchange: ExchangeName) => {
  return exchange === 'UniswapV3'
}

const ExchangeSummary = (props: {
  tokenPrice: BigNumber
  exchange: ExchangeName
}) => {
  const [tokenBalance, setTokenBalance] = useState<BigNumber>(BigNumber.from(0))
  const [wethBalance, setWethBalance] = useState<BigNumber>(BigNumber.from(0))
  const [maxTrade, setMaxTrade] = useState<BigNumber>(BigNumber.from(0))
  const [maxHalfTrade, setHalfMaxTrade] = useState<BigNumber>(BigNumber.from(0))
  const [maxSellTrade, setMaxSellTrade] = useState<BigNumber>(BigNumber.from(0))
  const [maxHalfSellTrade, setHalfMaxSellTrade] = useState<BigNumber>(
    BigNumber.from(0)
  )
  const [liquidityLoading, setLiquidityLoading] = useState(false)
  const [halfTradeLoading, setHalfTradeLoading] = useState(false)
  const [tradeLoading, setTradeLoading] = useState(false)

  const { ethereumPrice } = usePrices()
  const { selectedToken } = useContext(TokenContext)
  const tenPowDecimals = BigNumber.from(10).pow(selectedToken.decimals)
  const isUniV3 = getIsUniV3(props.exchange)

  useEffect(() => {
    setLiquidityLoading(true)
    getLiquidity(selectedToken.address, props.exchange)
      .then((response) => {
        setTokenBalance(response.tokenBalance)
        setWethBalance(response.wethBalance)
      })
      .finally(() => {
        setLiquidityLoading(false)
      })
  }, [props.exchange, selectedToken.address])

  useEffect(() => {
    setHalfTradeLoading(true)
    getMaxTrade(selectedToken.address, HALF_PERCENT, props.exchange)
      .then((response) => {
        setHalfMaxTrade(response.size)
        setHalfMaxSellTrade(response.sellSize)
      })
      .finally(() => setHalfTradeLoading(false))
  }, [isUniV3, props.exchange, selectedToken.address])

  useEffect(() => {
    setTradeLoading(true)
    getMaxTrade(selectedToken.address, ONE_PERCENT, props.exchange)
      .then((response) => {
        setMaxTrade(response.size)
        setMaxSellTrade(response.sellSize)
      })
      .finally(() => setTradeLoading(false))
  }, [isUniV3, props.exchange, selectedToken.address])

  const tokenTotal =
    props.tokenPrice
      .mul(tokenBalance)
      // Adjust balance if token decimals is not 18
      .mul(TEN_POW_18)
      .div(tenPowDecimals)
      .toNumber() / PRICE_DECIMALS
  const wethTotal = ethereumPrice.mul(wethBalance).toNumber() / PRICE_DECIMALS
  const totalLiquidity = tokenTotal + wethTotal
  const maxHalfTradeToken =
    maxHalfTrade.mul(PRICE_DECIMALS).div(tenPowDecimals).toNumber() /
    PRICE_DECIMALS
  const maxHalfSellTradeToken =
    maxHalfSellTrade.mul(PRICE_DECIMALS).div(tenPowDecimals).toNumber() /
    PRICE_DECIMALS
  const maxHalfTradeUSD =
    props.tokenPrice.mul(maxHalfTrade).div(tenPowDecimals).toNumber() /
    PRICE_DECIMALS
  const maxHalfSellTradeUSD =
    props.tokenPrice.mul(maxHalfSellTrade).div(tenPowDecimals).toNumber() /
    PRICE_DECIMALS
  const maxTradeUSD =
    props.tokenPrice.mul(maxTrade).div(tenPowDecimals).toNumber() /
    PRICE_DECIMALS
  const maxSellTradeUSD =
    props.tokenPrice.mul(maxSellTrade).div(tenPowDecimals).toNumber() /
    PRICE_DECIMALS

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
          <MaxTradeSize
            isUniV3={isUniV3}
            maxTrade={maxHalfTradeToken}
            maxSellTrade={maxHalfSellTradeToken}
            isToken={true}
          />
        )}
      </TableDataRightAlign>
      <TableDataRightAlign>
        {halfTradeLoading ? (
          <CircularProgress />
        ) : (
          <MaxTradeSize
            isUniV3={isUniV3}
            maxTrade={maxHalfTradeUSD}
            maxSellTrade={maxHalfSellTradeUSD}
          />
        )}
      </TableDataRightAlign>
      <TableDataRightAlign>
        {tradeLoading ? (
          <CircularProgress />
        ) : (
          <MaxTradeSize
            isUniV3={isUniV3}
            maxTrade={maxTradeUSD}
            maxSellTrade={maxSellTradeUSD}
          />
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

const MaxTradeSize = (props: {
  isUniV3: boolean
  maxTrade: number
  maxSellTrade: number
  isToken?: boolean
}) => {
  const format = props.isToken ? '0,0.00' : '$0,0.00'
  return props.isUniV3 ? (
    <div>
      <div> {numeral(props.maxTrade).format(format)} (buy)</div>
      <div> {numeral(props.maxSellTrade).format(format)} (sell)</div>
    </div>
  ) : (
    <div> {numeral(props.maxTrade).format(format)}</div>
  )
}
