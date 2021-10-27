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

const ExchangeSummary = (props: {
  tokenPrice: BigNumber
  exchange: ExchangeName
}) => {
  const [tokenBalance, setTokenBalance] = useState<BigNumber>(BigNumber.from(0))
  const [wethBalance, setWethBalance] = useState<BigNumber>(BigNumber.from(0))
  const [maxTrade, setMaxTrade] = useState<BigNumber>(BigNumber.from(0))
  const [maxHalfTrade, setHalfMaxTrade] = useState<BigNumber>(BigNumber.from(0))
  const { ethereumPrice } = usePrices()
  const [liquidityLoading, setLiquidityLoading] = useState(false)
  const [liquidityError, setLiquidityError] = useState(false)
  const [halfTradeLoading, setHalfTradeLoading] = useState(false)
  const [halfTradeError, setHalfTradeError] = useState(false)
  const [tradeLoading, setTradeLoading] = useState(false)
  const [tradeError, setTradeError] = useState(false)
  const { selectedToken } = useContext(TokenContext)
  const tenPowDecimals = BigNumber.from(10).pow(selectedToken.decimals)

  useEffect(() => {
    setLiquidityLoading(true)
    getLiquidity(selectedToken.address, props.exchange)
      .then((response) => {
        setTokenBalance(response.tokenBalance)
        setWethBalance(response.wethBalance)
        setLiquidityError(false)
      })
      .catch(() => {
        setLiquidityError(true)
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
        setHalfTradeError(false)
      })
      .catch(() => {
        setHalfTradeError(true)
      })
      .finally(() => setHalfTradeLoading(false))
  }, [props.exchange, selectedToken.address])

  useEffect(() => {
    setTradeLoading(true)
    getMaxTrade(selectedToken.address, ONE_PERCENT, props.exchange)
      .then((response) => {
        setMaxTrade(response.size)
        setTradeError(false)
      })
      .catch(() => {
        setTradeError(true)
      })
      .finally(() => setTradeLoading(false))
  }, [props.exchange, selectedToken.address])

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
  const maxHalfTradeUSD =
    props.tokenPrice.mul(maxHalfTrade).div(tenPowDecimals).toNumber() /
    PRICE_DECIMALS
  const maxTradeUSD =
    props.tokenPrice.mul(maxTrade).div(tenPowDecimals).toNumber() /
    PRICE_DECIMALS

  return (
    <>
      <TableData>{props.exchange}</TableData>
      <TableDataRightAlign>
        {liquidityLoading ? (
          <CircularProgress />
        ) : (
          <div>
            {liquidityError
              ? 'Error'
              : numeral(totalLiquidity).format('$0,0.00')}
          </div>
        )}
      </TableDataRightAlign>
      <TableDataRightAlign>
        {halfTradeLoading ? (
          <CircularProgress />
        ) : (
          <div>
            {' '}
            {halfTradeError
              ? 'Error'
              : numeral(maxHalfTradeToken).format('0,0.00')}
          </div>
        )}
      </TableDataRightAlign>
      <TableDataRightAlign>
        {halfTradeLoading ? (
          <CircularProgress />
        ) : (
          <div>
            {' '}
            {tradeError ? 'Error' : numeral(maxHalfTradeUSD).format('$0,0.00')}
          </div>
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
