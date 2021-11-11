import styled from 'styled-components'
import Box from '@mui/material/Box'
import { ChangeEvent, FocusEvent, useState, useEffect, useContext, Component, Fragment } from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { createFilterOptions } from '@mui/material/Autocomplete'
// import LiquidityTable from 'components/LiquidityTable'
import useDpiIndexComponents from 'hooks/useDpiIndexComponents'
import useMviIndexComponents from 'hooks/useMviIndexComponents'
import useBedIndexComponents from 'hooks/useBedIndexComponents'
import useDataIndexComponents from 'hooks/useDataIndexComponents'
import { format } from 'util'
import IndexComponent from 'components/IndexComponent'
import { PRICE_DECIMALS, TEN_POW_18, EXCHANGES, INDEX_TOKENS } from 'utils/constants/constants'
import { getMaxTrade, getLiquidity, ExchangeName } from 'utils/poolData'
import { TokenContext } from 'contexts/Token'
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
  const [maxTradeSize, setMaxTradeSize] = useState(0)
  const [bestExchange, setBestExchange] = useState('')
  const [maxTradeSizeUSD, setMaxTradeSizeUSD] = useState('')
  const [tradeError, setTradeError] = useState(false)
  const [tokenPrice, setTokenPrice] = useState<BigNumber>(BigNumber.from(0))
  const tenPowDecimals = BigNumber.from(10).pow(18)

// get token price in USD
  useEffect(() => {
    const tokenAddress = props.component.address.toLowerCase()
    fetch(getCoinGeckoApi(tokenAddress))
      .then((response) => response.json())
      .then((response) => {
        const {usd} = response[tokenAddress]
        setTokenPrice(BigNumber.from(Math.round(usd * PRICE_DECIMALS)))
      })
      .catch((error) => console.log(error))
  }, [props.component!.address])

  const onSlippageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAllowedSlippage(e.target.value)
    // updateTableDataRow
  }
  // const formatMaxT
  
  const checkMaxTrade = async (exchange: ExchangeName, component: IndexComponent) => {
    // if (!component) return null 

    setIsLoading(true)
    return await getMaxTrade(component.address, parseFloat(allowedSlippage), exchange)
      .then((response) => {
        return response.size
        setTradeError(false)
      })
      .catch((error) => {
        setTradeError(true)
        console.error(error.toString())
      })
  }
  const findMaxTrade = async (e: FocusEvent, component: IndexComponent) => {
    const checkExchanges = async () => Promise.all(
      EXCHANGES.map((exchange) => checkMaxTrade(exchange, component)
        .then((response) => {
          return {
            exchange,
            response,
            compressedResponse: response?.div(tenPowDecimals).toNumber()
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
      let sorted = [...exchangeMaxTrades].sort((a,b) => a && b ? b - a : 0)
      const indexOfBestTrade = exchangeMaxTrades.indexOf(sorted[0])
      setIsLoading(false)
      return resultsFromExchanges![indexOfBestTrade]
    }
    const bestTrade = findBestTrade()
    setBestExchange(bestTrade!.exchange)
    setMaxTrade(bestTrade!.response)
  }
  const renderDataTableRow = (component: IndexComponent | undefined) => {
    if (!component) return null
    const maxTradeToken =
      maxTrade!.mul(PRICE_DECIMALS).div(tenPowDecimals).toNumber() /
      PRICE_DECIMALS
    const maxTradeUSD =
      tokenPrice.mul(maxTrade!).div(tenPowDecimals).toNumber() /
      PRICE_DECIMALS
    return (
      <>
        <TableData>{component.symbol}</TableData>
        <TableData>{component.percentOfSet}</TableData>
        <TableData>
          <TextField
              value={allowedSlippage}
              onChange={onSlippageChange}
              onBlur={(e) => findMaxTrade(e, component)}
              inputProps={{
                autoComplete: 'new-password', // disable autocomplete and autofill
              }}
            />
        </TableData>
        <TableData>{isLoading ? <CircularProgress /> : bestExchange}</TableData>
        <TableData>{isLoading ? <CircularProgress /> : tradeError ? 'error' : formatDisplay(maxTradeToken)}</TableData>
        <TableData>{isLoading ? <CircularProgress /> : tradeError ? 'error' : formatUSD(maxTradeUSD)}</TableData>
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
  font-size: 18px;
  font-weight: 600;
  border-bottom: 2px solid black;
  // padding-right: 10px;
`
const TableData = styled.div`
  font-size: 16px;
  line-height: 24px;
  border-bottom: 1px solid gray;
`
