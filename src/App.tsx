import React, { useEffect } from 'react'

import 'App.css'
import { YFI_ABI, YFI_ADDRESS } from 'utils/constants/tokens'
import { PricesProvider } from 'contexts/Prices'
import V3Liquidity from 'components/V3Liquidity'
import V2Liquidity from 'components/V2Liquidity'
import SushiSwapLiquidity from 'components/SushiSwapLiquidity'
import KyberLiquidity from 'components/KyberLiquidity'
import BalancerLiquidity from 'components/BalancerLiquidity'

const App: React.FC = () => {
  useEffect(() => {
    return
  }, [])

  return (
    <PricesProvider>
      <div className='App'>
        <header className='App-header'>
          <h2>YFI</h2>
          <V3Liquidity
            tokenAddress={YFI_ADDRESS}
            tokenAbi={YFI_ABI}
          ></V3Liquidity>
          <V2Liquidity tokenAddress={YFI_ADDRESS}></V2Liquidity>
          <SushiSwapLiquidity tokenAddress={YFI_ADDRESS}></SushiSwapLiquidity>
          <KyberLiquidity tokenAddress={YFI_ADDRESS}></KyberLiquidity>
          <BalancerLiquidity
            tokenAddress={YFI_ADDRESS}
            tokenAbi={YFI_ABI}
          ></BalancerLiquidity>
        </header>
      </div>
    </PricesProvider>
  )
}

export default App
