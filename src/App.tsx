import React, { useEffect, useState, ChangeEvent } from 'react'

import 'App.css'
import { PricesProvider } from 'contexts/Prices'
import { TokenProvider } from 'contexts/Token'
import LiquidityTable from 'components/LiquidityTable'
import TokenSelect from 'components/TokenSelect'
import TokenTitle from 'components/TokenTitle'

const App: React.FC = () => {
  const [desiredAmount, setDesiredAmount] = useState('')
  
  useEffect(() => {
    return
  }, [])

  const onDesiredAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDesiredAmount(e.target.value)
  }

  const props = {
    desiredAmount, 
    onDesiredAmountChange
  }

  return (
    <TokenProvider>
      <PricesProvider>
        <div className='App'>
          <header className='App-header'>
            <TokenTitle />
            <TokenSelect 
              {...props}
            />
            <LiquidityTable
              {...props}
            />
          </header>
        </div>
      </PricesProvider>
    </TokenProvider>
  )
}

export default App
