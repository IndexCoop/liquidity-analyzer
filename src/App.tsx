import React, { useState, ChangeEvent, MouseEvent } from 'react'
import TextField from '@mui/material/TextField'
import 'App.css'
import { PricesProvider } from 'contexts/Prices'
import { TokenProvider } from 'contexts/Token'
import LiquidityTable from 'components/LiquidityTable'
import NetworkSelector from 'components/NetworkSelector'
import TokenSelect from 'components/TokenSelect'
import TokenTitle from 'components/TokenTitle'
import TabNavigator from 'components/TabNavigator'
import IndexLiquidityTab from 'components/IndexLiquidityTab/IndexLiquidityTab'
import styled from 'styled-components'
import { DpiIndexComponentsProvider } from 'contexts/DpiIndexComponents'
import { MviIndexComponentsProvider } from 'contexts/MviIndexComponents'
import { BedIndexComponentsProvider } from 'contexts/BedIndexComponents'
import { DataIndexComponentsProvider } from 'contexts/DataIndexComponents'

const TABS = {
  tokenLiquidity: 'Token Liquidity',
  indexLiquidity: 'Index Liquidity'
}

const App: React.FC = () => {
  const [desiredAmount, setDesiredAmount] = useState('')
  const [activeTab, setActiveTab] = useState(TABS.indexLiquidity)
  const onActiveTabChange = (e: MouseEvent): void => {
    setActiveTab(e.currentTarget.innerHTML)
  }
  const onDesiredAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDesiredAmount(e.target.value)
  }
  const renderTokenLiquidityTab = () => {
    return activeTab === TABS.tokenLiquidity
      ? <>
          <TitleHeader>
            <TokenTitle />
            <NetworkSelector />
          </TitleHeader>
          <Container>
            <TokenSelect
              {...props}
            />
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
          <LiquidityTable
            {...props}
          />
        </>
      : null
  }
  const renderIndexLiquidityTab = () => {
    return activeTab === TABS.indexLiquidity
      ? <>
          <IndexLiquidityTab 
            {...props}
          />
        </>
      : null
  }
  const props = {
    desiredAmount, 
    onDesiredAmountChange
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
    <DpiIndexComponentsProvider>
      <MviIndexComponentsProvider>
        <BedIndexComponentsProvider>
          <DataIndexComponentsProvider>
            <TokenProvider>
              <PricesProvider>
                {children}
              </PricesProvider>
            </TokenProvider>
          </DataIndexComponentsProvider>
        </BedIndexComponentsProvider>
      </MviIndexComponentsProvider>
    </DpiIndexComponentsProvider>
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
