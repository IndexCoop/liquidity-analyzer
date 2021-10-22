import { BigNumber } from 'ethers'
import { createContext } from 'react'

interface PricesContextValues {
  ethereumPrice: BigNumber
}

const PricesContext = createContext<PricesContextValues>({
  ethereumPrice: BigNumber.from(0),
})

export default PricesContext
