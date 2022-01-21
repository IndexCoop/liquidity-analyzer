import styled from 'styled-components'
import { ChangeEvent, useState, useEffect } from 'react'
import TextField from '@mui/material/TextField'
import IndexComponent from 'components/IndexComponent'
import {
  ChainId,
  PRICE_DECIMALS,
  REBALANCE_EXCHANGES,
  EXCHANGETOSTRING,
  TEN_POW_18,
} from 'utils/constants/constants'
import { getMaxTrade, ExchangeName } from 'utils/poolData'
import { BigNumber } from 'ethers'
import CircularProgress from '@mui/material/CircularProgress'
import { getCoinGeckoApi } from 'utils/constants/constants'
import { formatDisplay, formatUSD } from 'utils/formatters'

type props = {
  component: IndexComponent
}
const IndexLiquidityDataTableRow = (props: props) => {
  const [maxTrade, setMaxTrade] = useState<void | BigNumber>(BigNumber.from(0))
  const [allowedSlippage, setAllowedSlippage] = useState('0.5')
  const [isLoading, setIsLoading] = useState(false)
  const [bestExchange, setBestExchange] = useState('')
  const [tradeError, setTradeError] = useState(false)
  const [tokenPrice, setTokenPrice] = useState<BigNumber>(BigNumber.from(0))

  // get token price in USD
  useEffect(() => {
    const tokenAddress = props.component.address.toLowerCase()
    fetch(getCoinGeckoApi(tokenAddress))
      .then((response) => response.json())
      .then((response) => {
        const { usd } = response[tokenAddress]
        setTokenPrice(BigNumber.from(Math.round(usd * PRICE_DECIMALS)))
      })
      .catch((error) => console.log(error))
  }, [props.component.address])
  useEffect((): void => {
    findMaxTrade(props.component)
  }, [props.component])
  const onSlippageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAllowedSlippage(e.target.value)
  }
  const checkMaxTrade = async (
    exchange: ExchangeName,
    component: IndexComponent
  ) => {
    setIsLoading(true)
    return await getMaxTrade(
      component.address,
      parseFloat(allowedSlippage),
      exchange,
      ChainId.ethereum
    )
      .then((response) => {
        setTradeError(false)
        return response.size
      })
      .catch((error) => {
        setTradeError(true)
        console.error(error.toString())
      })
  }
  const findMaxTrade = async (component: IndexComponent) => {
    const checkExchanges = async () =>
      Promise.all(
        REBALANCE_EXCHANGES.map((exchange) =>
          checkMaxTrade(exchange, component)
            .then((response) => {
              return {
                exchange,
                response,
                compressedResponse: response?.div(TEN_POW_18).toNumber(),
              }
            })
            .catch((error) => {
              setTradeError(true)
              console.error(error.toString())
            })
        )
      ).catch((error) => {
        setTradeError(true)
        console.error(error.toString())
      })
    const resultsFromExchanges = await checkExchanges()
    const exchangeMaxTrades = resultsFromExchanges!.map((exchangeObject) => {
      if (exchangeObject && exchangeObject.compressedResponse) {
        return exchangeObject.compressedResponse
      }
    })
    const findBestTrade = () => {
      let sorted = [...exchangeMaxTrades].sort((a, b) => (a && b ? b - a : 0))
      const indexOfBestTrade = exchangeMaxTrades.indexOf(sorted[0])
      setIsLoading(false)
      return resultsFromExchanges![indexOfBestTrade]
    }
    const bestTrade = findBestTrade()
    setBestExchange(EXCHANGETOSTRING[bestTrade!.exchange])
    setMaxTrade(bestTrade!.response)
  }
  const renderDataTableRow = (component: IndexComponent | undefined) => {
    if (!component) return null
    const maxTradeToken =
      maxTrade!.mul(PRICE_DECIMALS).div(TEN_POW_18).toNumber() / PRICE_DECIMALS
    const maxTradeUSD =
      tokenPrice.mul(maxTrade!).div(TEN_POW_18).toNumber() / PRICE_DECIMALS
    return (
      <>
        <TableData>{component.symbol}</TableData>
        <TableDataRightAlign>{component.percentOfSet}</TableDataRightAlign>
        <TableDataRightAlign>
          <TextField
            value={allowedSlippage}
            onChange={onSlippageChange}
            onBlur={(e) => findMaxTrade(component)}
            style={textFieldStyles}
            inputProps={{
              autoComplete: 'new-password', // disable autocomplete and autofill
            }}
          />
        </TableDataRightAlign>
        <TableDataRightAlign>
          {isLoading ? <CircularProgress /> : bestExchange}
        </TableDataRightAlign>
        <TableDataRightAlign>
          {isLoading ? (
            <CircularProgress />
          ) : tradeError ? (
            'error'
          ) : (
            formatDisplay(maxTradeToken)
          )}
        </TableDataRightAlign>
        <TableDataRightAlign>
          {isLoading ? (
            <CircularProgress />
          ) : tradeError ? (
            'error'
          ) : (
            formatUSD(maxTradeUSD)
          )}
        </TableDataRightAlign>
      </>
    )
  }
  if (props.component) {
    return renderDataTableRow(props.component)
  }
  return null
}

export default IndexLiquidityDataTableRow

const TableHeader = styled.div`
  margin: 0;
  height: 60px;
  font-size: 18px;
  border-bottom: 2px solid black;
`
const TableData = styled.div`
  font-size: 18px;
  height: 60px;
  line-height: 24px;
  border-bottom: 1px solid gray;
`
const textFieldStyles = {
  height: 20,
  borderLeftWidth: 10,
  borderLeftColor: '#222',
  paddingLeft: 50,
}

const TableDataRightAlign = styled(TableHeader)`
  font-size: 18px;
  line-height: 24px;
  font-weight: 500;
  text-align: right;
  border-bottom: 1px solid gray;
`
