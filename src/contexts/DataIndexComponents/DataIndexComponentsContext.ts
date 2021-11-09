import { createContext } from 'react'
import IndexComponent from 'components/IndexComponent'

interface DataIndexComponentsProps {
  components?: IndexComponent[]
}

const DataIndexMarketData = createContext<DataIndexComponentsProps>({})

export default DataIndexMarketData
