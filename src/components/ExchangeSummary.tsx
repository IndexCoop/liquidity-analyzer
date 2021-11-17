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

type ExchangeId =
  | 'uniswap_v2'
  | 'uniswap'
  | 'kyber_network'
  | 'sushiswap'
  | 'balancer'

const exchangeIdMapping: Record<ExchangeName, ExchangeId> = {
  UniswapV2: 'uniswap_v2',
  UniswapV3: 'uniswap',
  Kyber: 'kyber_network',
  Sushiswap: 'sushiswap',
  Balancer: 'balancer',
}

function getLastDayVolume(id: ExchangeId): Promise<number> {
  return fetch(`https://api.coingecko.com/api/v3/exchanges/${id}`)
    .then((res) => res.json())
    .then((res) => res.trade_volume_24h_btc)
}

const ExchangeSummary = (props: {
  tokenPrice: BigNumber
  exchange: ExchangeName
  desiredAmount: string
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
  const [lastDayVolume, setLastDayVolume] = useState<number>(0)
  const [lastDayVolumeLoading, setLastDayVolumeLoading] = useState(false)
  const [lastDayVolumeError, setLastDayVolumeError] = useState(false)
  const { selectedToken } = useContext(TokenContext)
  const tenPowDecimals = BigNumber.from(10).pow(selectedToken.decimals)

  useEffect(() => {
    setLastDayVolumeLoading(true)
    getLastDayVolume(exchangeIdMapping[props.exchange])
      .then((res) => setLastDayVolume(res))
      .catch(() => setLastDayVolumeError(true))
      .finally(() => setLastDayVolumeLoading(false))
  }, [props.exchange])

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
  const calculateMaxNumberOfTrades = (maxTrade: number) => {
    const desiredAmount = parseInt(props.desiredAmount)
    return desiredAmount > 0 && maxTrade > 0
      ? Math.ceil(desiredAmount / maxTrade).toString()
      : '0'
  }
  const formatUSD = (value: number) => numeral(value).format('$0,0.00')
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
      <TableData>{props.exchange}</TableData>
      {renderCustomTableData(
        liquidityLoading,
        formatUSD(totalLiquidity),
        liquidityError
      )}
      {renderCustomTableData(
        halfTradeLoading,
        numeral(maxHalfTradeToken).format('0,0.00'),
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
      {renderCustomTableData(
        lastDayVolumeLoading,
        lastDayVolume.toFixed(2).toString(),
        lastDayVolumeError
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
