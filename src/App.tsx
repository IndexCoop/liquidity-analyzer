import React, { useEffect } from 'react'

import 'App.css'
import { YFI } from 'utils/constants/tokens'
import { PricesProvider } from 'contexts/Prices'
import LiquidityTable from 'components/LiquidityTable'

const App: React.FC = () => {
  useEffect(() => {
    return
  }, [])

  return (
    <PricesProvider>
      <div className='App'>
        <header className='App-header'>
          <h2>YFI</h2>
          <LiquidityTable tokenAddress={YFI}></LiquidityTable>
        </header>
      </div>
    </PricesProvider>
  )
}

export default App
