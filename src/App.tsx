import React, { useEffect } from 'react'
import logo from './logo.svg'
import './App.css'
import { getUniswapV3Quote } from './utils/poolData'
import { YFI_ABI, YFI_ADDRESS } from './utils/constants/tokens'
import { PricesProvider } from './contexts/Prices'

const App: React.FC = () => {
  useEffect(() => {
    getUniswapV3Quote(YFI_ADDRESS, YFI_ABI)
    return
  }, [])

  return (
    <PricesProvider>
      <div className='App'>
        <header className='App-header'>
          <h1>YFI</h1>
          <h3>Uniswap V3 Liquidity</h3>
        </header>
      </div>
    </PricesProvider>
  )
}

export default App
