import React, { useState, ChangeEvent, MouseEvent } from 'react'
import TextField from '@mui/material/TextField'
import 'App.css'
import LiquidityTable from 'components/LiquidityTable'
import NetworkSelector from 'components/NetworkSelector'
import TokenSelect from 'components/TokenSelect'
import TokenTitle from 'components/TokenTitle'
import TabNavigator from 'components/TabNavigator'
import IndexLiquidityTab from 'components/IndexLiquidityTab/IndexLiquidityTab'
import styled from 'styled-components'
import { MarketDataProvider } from 'contexts/MarketData'

import { ChainId } from './utils/constants/constants'

const TABS = {
  tokenLiquidity: 'Token Liquidity',
  indexLiquidity: 'Index Liquidity',
}

const App: React.FC = () => {
  const [chainId, setChainId] = useState(ChainId.ethereum)
  const [desiredAmount, setDesiredAmount] = useState('')
  const [activeTab, setActiveTab] = useState(TABS.tokenLiquidity)
  const onActiveTabChange = (e: MouseEvent): void => {
    setActiveTab(e.currentTarget.innerHTML)
  }
  const onDesiredAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDesiredAmount(e.target.value)
  }
  const onSelectedNetwork = (chainId: ChainId) => {
    setChainId(chainId)
  }
  const renderTokenLiquidityTab = () => {
    return activeTab === TABS.tokenLiquidity ? (
      <>
        <TitleHeader>
          <TokenTitle />
          <NetworkSelector didSelectNetwork={onSelectedNetwork} />
        </TitleHeader>
        <Container>
          <TokenSelect {...props} />
          <StyledLabel>$</StyledLabel>
          <TextField
            value={props.desiredAmount}
            onChange={props.onDesiredAmountChange}
            label='Desired Amount'
            inputProps={{
              autoComplete: 'new-password', // disable autocomplete and autofill
            }}
          />
        </Container>
        <LiquidityTable {...props} />
      </>
    ) : null
  }
  const renderIndexLiquidityTab = () => {
    return activeTab === TABS.indexLiquidity ? (
      <>
        <IndexLiquidityTab {...props} />
      </>
    ) : null
  }
  const props = {
    chainId,
    desiredAmount,
    onDesiredAmountChange,
  }
  return (
    <Providers>
      <div className='App'>
        <header className='App-header'>
          <TabNavigator
            activeTab={activeTab}
            tabs={TABS}
            onActiveTabChange={onActiveTabChange}
          />
          {renderTokenLiquidityTab()}
          {renderIndexLiquidityTab()}
        </header>
      </div>
    </Providers>
  )
}

const Providers: React.FC = ({ children }) => {
  return (
        <MarketDataProvider>{children}</MarketDataProvider>
  )
}


export default App

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
`

const StyledLabel = styled.label`
  padding-left: 15px;
  padding-right: 5px;
`

const TitleHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: left;
`
