import { BigNumber } from 'ethers'
import React, { useState, useEffect } from 'react'

import { CG_ETH_PRICE_URL, getCoinGeckoApi } from 'utils/constants/constants'
import { YFI_ADDRESS } from 'utils/constants/tokens'
import PricesContext from './PricesContext'

const PricesProvider: React.FC = ({ children }) => {
  const [ethereumPrice, setEthereumPrice] = useState<BigNumber>(
    BigNumber.from(0)
  )
  const [yfiPrice, setYfiPrice] = useState<BigNumber>(BigNumber.from(0))

  // get ETH price in USD
  useEffect(() => {
    fetch(CG_ETH_PRICE_URL)
      .then((response) => response.json())
      .then((response) => {
        setEthereumPrice(BigNumber.from(response?.ethereum?.usd))
      })
      .catch((error) => console.log(error))
  }, [ethereumPrice])

  // get YFI price in USD
  useEffect(() => {
    fetch(getCoinGeckoApi(YFI_ADDRESS))
      .then((response) => response.json())
      .then((response) => {
        setYfiPrice(BigNumber.from(response[YFI_ADDRESS]?.usd))
      })
      .catch((error) => console.log(error))
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
