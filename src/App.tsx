import React, { useEffect } from 'react'

import 'App.css'
import { YFI_ABI, YFI_ADDRESS } from 'utils/constants/tokens'
import { PricesProvider } from 'contexts/Prices'
import TotalLiquidity from 'components/TotalLiquidity'

const App: React.FC = () => {
  useEffect(() => {
    return
  }, [])

  return (
    <PricesProvider>
      <div className='App'>
        <header className='App-header'>
          <h1>YFI</h1>
          <h3>Uniswap V3 Liquidity</h3>
          <TotalLiquidity
            tokenAddress={YFI_ADDRESS}
            tokenAbi={YFI_ABI}
          ></TotalLiquidity>
        </header>
      </div>
    </PricesProvider>
  )
}

export default App
