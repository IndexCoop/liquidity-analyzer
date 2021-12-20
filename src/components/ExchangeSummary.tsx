import { BigNumber } from 'ethers'
import useMarketData from 'hooks/useMarketDataComponents'
import { useEffect, useState, useContext } from 'react'
import styled from 'styled-components'
import { getMaxTrade, getLiquidity, ExchangeName } from 'utils/poolData'
import { ChainId, PRICE_DECIMALS, EXCHANGES } from '../utils/constants/constants'
import CircularProgress from '@mui/material/CircularProgress'
import { MarketDataContext } from 'contexts/MarketData'
import { formatDisplay, formatUSD } from 'utils/formatters'

const HALF_PERCENT = 0.5
const ONE_PERCENT = 1

const ExchangeSummary = (props: {
  tokenPrice: BigNumber
  exchange: ExchangeName
  desiredAmount: string
  chainId: ChainId
}) => {
  const [tokenBalance, setTokenBalance] = useState<BigNumber>(BigNumber.from(0))
  const [wethBalance, setWethBalance] = useState<BigNumber>(BigNumber.from(0))
  const [maxTrade, setMaxTrade] = useState<BigNumber>(BigNumber.from(0))
  const [maxHalfTrade, setHalfMaxTrade] = useState<BigNumber>(BigNumber.from(0))
  const { ethereumPrice } = useMarketData()
  const [liquidityLoading, setLiquidityLoading] = useState(false)
  const [liquidityError, setLiquidityError] = useState(false)
  const [halfTradeLoading, setHalfTradeLoading] = useState(false)
  const [halfTradeError, setHalfTradeError] = useState(false)
  const [tradeLoading, setTradeLoading] = useState(false)
  const [tradeError, setTradeError] = useState(false)
  const { selectedToken } = useContext(MarketDataContext)
  const tenPowDecimals = BigNumber.from(10).pow(selectedToken.decimals)

  const exchangeNamesMap =  {
    UniswapV3fee005: 'Uniswap (0.05% fee tier)',
    UniswapV3fee03: 'Uniswap (0.30% fee tier)',
    UniswapV3fee1: 'Uniswap (0.1% fee tier)',
    UniswapV2: 'UniswapV2',
    Sushiswap: 'Sushiswap',
    Kyber: 'Kyber',
    Balancer:'Balancer',
    ZeroEx: 'ZeroEx',
  }

  useEffect(() => {
    setLiquidityLoading(true)
    getLiquidity(selectedToken.address, props.exchange, props.chainId)
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
  }, [props.chainId, props.exchange, selectedToken.address])

  useEffect(() => {
    setHalfTradeLoading(true)
    getMaxTrade(
      selectedToken.address,
      HALF_PERCENT,
      props.exchange,
      props.chainId
    )
      .then((response) => {
        setHalfMaxTrade(response.size)
        setHalfTradeError(false)
      })
      .catch(() => {
        setHalfTradeError(true)
      })
      .finally(() => setHalfTradeLoading(false))
  }, [props.chainId, props.exchange, selectedToken.address])

  useEffect(() => {
    setTradeLoading(true)
    getMaxTrade(
      selectedToken.address,
      ONE_PERCENT,
      props.exchange,
      props.chainId
    )
      .then((response) => {
        setMaxTrade(response.size)
        setTradeError(false)
      })
      .catch(() => {
        setTradeError(true)
      })
      .finally(() => setTradeLoading(false))
  }, [props.chainId, props.exchange, selectedToken.address])

  const tokenTotal =
    props.tokenPrice.mul(tokenBalance).toNumber() / PRICE_DECIMALS
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
  const calculateMaxNumberOfTrades = (maxTrade: number) => {
    const desiredAmount = parseInt(props.desiredAmount)
    return desiredAmount > 0 && maxTrade > 0
      ? Math.ceil(desiredAmount / maxTrade).toString()
      : '0'
  }
  const renderCustomTableData = (
    isLoading: boolean,
    value: string,
    isError?: boolean
  ) => {
    return (
      <TableDataRightAlign>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <div>{isError ? 'Error' : value}</div>
        )}
      </TableDataRightAlign>
    )
  }
  return (
    <>
      <TableData>{exchangeNamesMap[props.exchange]}</TableData>
      {renderCustomTableData(
        liquidityLoading,
        formatUSD(totalLiquidity),
        liquidityError
      )}
      {renderCustomTableData(
        halfTradeLoading,
        formatDisplay(maxHalfTradeToken),
        halfTradeError
      )}
      {renderCustomTableData(
        halfTradeLoading,
        formatUSD(maxHalfTradeUSD),
        tradeError
      )}
      {renderCustomTableData(
        halfTradeLoading,
        calculateMaxNumberOfTrades(maxHalfTradeUSD),
        tradeError
      )}
      {renderCustomTableData(tradeLoading, formatUSD(maxTradeUSD))}
      {renderCustomTableData(
        tradeLoading,
        calculateMaxNumberOfTrades(maxTradeUSD)
      )}
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
