import React, { useState, useEffect } from 'react'
import BigNumber from '../../utils/bignumber'
import {
  CG_ETH_PRICE_URL,
  getCoinGeckoApi,
} from '../../utils/constants/constants'
import { YFI_ADDRESS } from '../../utils/constants/tokens'

import PricesContext from './PricesContext'

const PricesProvider: React.FC = ({ children }) => {
  const [ethereumPrice, setEthereumPrice] = useState<string>('0')
  const [yfiPrice, setYfiPrice] = useState<string>('0')

  // get ETH price in USD
  useEffect(() => {
    fetch(CG_ETH_PRICE_URL)
      .then((response) => response.json())
      .then((response) => {
        setEthereumPrice(response?.ethereum?.usd || '0')
      })
      .catch((error) => console.log(error))

    console.log('ethprice', ethereumPrice)
  }, [ethereumPrice])

  // get YFI price in USD
  useEffect(() => {
    fetch(getCoinGeckoApi(YFI_ADDRESS))
      .then((response) => response.json())
      .then((response) => {
        setYfiPrice(response?.ethereum?.usd || '0')
      })
      .catch((error) => console.log(error))

    console.log('yfiPrice', yfiPrice)
  }, [yfiPrice])

  return (
    <PricesContext.Provider
      value={{
        yfiPrice,
        ethereumPrice,
      }}
    >
      {children}
    </PricesContext.Provider>
  )
}

export default PricesProvider
