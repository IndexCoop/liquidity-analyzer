import React, { useEffect } from 'react'

import 'App.css'
import { PricesProvider } from 'contexts/Prices'
import { TokenProvider } from 'contexts/Token'
import LiquidityTable from 'components/LiquidityTable'
import TokenSelect from 'components/TokenSelect'
import TokenTitle from 'components/TokenTitle'

const App: React.FC = () => {
  useEffect(() => {
    return
  }, [])

  return (
    <TokenProvider>
      <PricesProvider>
        <div className='App'>
          <header className='App-header'>
            <TokenTitle />
            <TokenSelect />
            <LiquidityTable />
          </header>
        </div>
      </PricesProvider>
    </TokenProvider>
  )
}

export default App
