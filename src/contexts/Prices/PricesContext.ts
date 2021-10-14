import { createContext } from 'react'

interface PricesContextValues {
  yfiPrice?: string
  ethereumPrice?: string
}

const PricesContext = createContext<PricesContextValues>({})

export default PricesContext
