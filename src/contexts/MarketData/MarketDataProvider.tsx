import React, { useState, useEffect } from 'react'
import { BigNumber } from 'ethers'
import { CG_ETH_PRICE_URL, PRICE_DECIMALS } from 'utils/constants/constants'
import MarketDataContext, { defaultToken } from './MarketDataContext'
import { fetchSetComponents } from 'utils/tokensetsApi'
import { TokenData } from './types'


const MarketDataProvider: React.FC = ({ children }) => {
  const [bedIndexComponents, setBedIndexComponents] = useState<any>([])
  const [dataIndexComponents, setDataIndexComponents] = useState<any>([])
  const [dpiIndexComponents, setDpiIndexComponents] = useState<any>([])
  const [mviIndexComponents, setMviIndexComponents] = useState<any>([])
  const [ethereumPrice, setEthereumPrice] = useState<BigNumber>(
    BigNumber.from(0)
  )
  const [selectedToken, setSelectedToken] = useState<TokenData>(defaultToken)


  useEffect(() => {
    fetchSetComponents('bed')
      .then((response: any) => {
        setBedIndexComponents(response)
      })
      .catch((error: any) => console.log(error))
  }, [])

  useEffect(() => {
    fetchSetComponents('data')
      .then((response: any) => {
        setDataIndexComponents(response)
      })
      .catch((error: any) => console.log(error))
  }, [])
  
  useEffect(() => {
    fetchSetComponents('dpi')
      .then((response: any) => {
        setDpiIndexComponents(response)
      })
      .catch((error: any) => console.log(error))
  }, [])


  useEffect(() => {
    fetchSetComponents('mvi')
      .then((res) => {
        setMviIndexComponents(res)
      })
      .catch((error: any) => console.log(error))
  }, [])

  // get ETH price in USD
  useEffect(() => {
    fetch(CG_ETH_PRICE_URL)
      .then((response) => response.json())
      .then((response) => {
        setEthereumPrice(BigNumber.from(response?.ethereum?.usd * PRICE_DECIMALS))
      })
      .catch((error) => console.log(error))
  }, [])
  
  return (
    <MarketDataContext.Provider
      value={{ bedComponent: bedIndexComponents, 
        dpiComponent: dpiIndexComponents, 
        dataComponent: dataIndexComponents, 
        mviComponent: mviIndexComponents,
        ethereumPrice,
        selectedToken,
        setSelectedToken,
      }}
    >
      {children}
    </MarketDataContext.Provider>
  )
}

export default MarketDataProvider
