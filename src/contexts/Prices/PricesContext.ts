import { BigNumber } from 'ethers'
import { createContext } from 'react'

interface PricesContextValues {
  yfiPrice: BigNumber
  ethereumPrice: BigNumber
}

const PricesContext = createContext<PricesContextValues>({
  yfiPrice: BigNumber.from(0),
  ethereumPrice: BigNumber.from(0),
})

export default PricesContext
