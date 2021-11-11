import styled from 'styled-components'
import { ChangeEvent, useState, useEffect, useContext } from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import useDpiIndexComponents from 'hooks/useDpiIndexComponents'
import useMviIndexComponents from 'hooks/useMviIndexComponents'
import useBedIndexComponents from 'hooks/useBedIndexComponents'
import useDataIndexComponents from 'hooks/useDataIndexComponents'
import IndexComponent from 'components/IndexComponent'
import { INDEX_TOKENS, INDEX_TOKENS_FOR_SELECT } from 'utils/constants/constants'
import IndexLiquidityDataTableRow from './IndexLiquidityDataTableRow'

interface props {
  desiredAmount: string,
  onDesiredAmountChange: (arg0: ChangeEvent<HTMLInputElement>) => void  
}
const DATA_TABLE_HEADERS = [
  'Component',
  'Weight %',
  'Slippage Allowed',
  'Best Exchange',
  'Max Trade Size (Units)', 
  'Max Trade Size ($)'
] 
const DATA_TABLE_SIMULATION_HEADERS = [
  'Component',
  'Weight %',
  'Target %',
  '% Change', 
  '% Change',
  'Slippage Allowed',
  'Best Exchange', 
  'Max Trade Size (Units)', 
  'Max Trade Size ($)', 
  'No. of Trades', 
  'Estimated Cost'
]
const IndexLiquidityTab = (props: props) => {
  const [shouldSimulateRebalance, setShouldSimulateRebalance] = useState(false)
  const [selectedToken, setSelectedToken] = useState('')
  const bedComponents = useBedIndexComponents().components
  const dataComponents = useDataIndexComponents().components
  const dpiComponents = useDpiIndexComponents().components
  const mviComponents = useMviIndexComponents().components
  const RebalanceCheckbox = () => {
    return (
      <CheckboxContainer>
        <Checkbox
          checked={shouldSimulateRebalance}
          onChange={() => setShouldSimulateRebalance(!shouldSimulateRebalance)}
        />
        <Text onClick={() => setShouldSimulateRebalance(!shouldSimulateRebalance)}>
          Simulate Rebalance
        </Text>
      </CheckboxContainer>
    )
  }
  const renderDataTableHeaders = () => {
    if (shouldSimulateRebalance) {
      return DATA_TABLE_SIMULATION_HEADERS.map((title, index) => {
        return (
          <TableHeaderRightAlign key={index}>
            {title}
          </TableHeaderRightAlign>
        )
      })
    }
    return DATA_TABLE_HEADERS.map((title, index) => {
      return (
        <TableHeaderRightAlign key={index}>
          {title}
        </TableHeaderRightAlign>
      )
    })
  }
  const renderComponentsDataTable = () => {
    const formatDataTableRow = (components: IndexComponent[]) => {
      return components?.map((component, index) => 
        <IndexLiquidityDataTableRow 
          component={component} 
          key={index} 
        />
      )
    }
    switch (selectedToken) {
        case INDEX_TOKENS.BED.name:
          return formatDataTableRow(bedComponents!) 
        case INDEX_TOKENS.DATA.name:
          return formatDataTableRow(dataComponents!) 
        case INDEX_TOKENS.DPI.name:
          return formatDataTableRow(dpiComponents!) 
        case INDEX_TOKENS.MVI.name:
          return formatDataTableRow(mviComponents!) 
        default:
          return null
      }
  }
  const SelectAToken = () => {
    return (
      <TitleContainer>
        <Title>
          Select a token from the dropdown
        </Title>
      </TitleContainer>
    )
  }
  return (
    <TabContainer>
      <HeaderRow>
        <Autocomplete
          id='token-select'
          sx={{ width: 300 }}
          options={INDEX_TOKENS_FOR_SELECT}
          autoHighlight
          onChange={(_, value) => {
            if (value != null) setSelectedToken(value.name)
          }}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => (
            <TextField
              {...params}
              label='Choose a token'
              inputProps={{
                ...params.inputProps,
                inputMode: 'numeric',
                autoComplete: 'new-password', // disable autocomplete and autofill
              }}
            />
          )}
        />

        {/* TODO: Add functionality */}
        {/* via Simulate Rebalance Epic */}
        <RebalanceCheckbox />
        
        <TextContainer>
          <TextLabel>
            Market Cap:
            <Text>$0.00 - src needed</Text>  
          </TextLabel>
          
          <TextLabel>
            Net Asset Value:
            <Text>$0.00 - src needed</Text>  
          </TextLabel>
        </TextContainer>

      </HeaderRow>
      
      <InstructionContainer>
        <InstructionsText>
            Each component's data loads when you remove focus from its Slippage Allowed input. 
        </InstructionsText>
      </InstructionContainer>

      <DataTable>
        {
          selectedToken
            ? <>
                {renderDataTableHeaders()}
                {renderComponentsDataTable()}
              </>
            : <SelectAToken />
        }
      </DataTable>
    </TabContainer>
  )
}

export default IndexLiquidityTab

const TabContainer = styled.div`
  display: flex;
  flex: 10;
  position: relative;
  align-items: flex-start;
  flex-direction: column;
  justify-content: space-around;
` 

const TitleContainer = styled.div`
  display: flex;
  position: absolute;
  top: 30%;
  left: 10%;
  justify-content: center;
  align-items: center;
`
const Title = styled.div`
  font-size: 40px;
  font-weight: 600;
`

const HeaderRow = styled.div`
  display: flex;
  padding-top: 15px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex: .2;
`

const InstructionContainer = styled.div`
  display: flex;
  margin-top: 10px;
  margin-bottom: 10px; 
  align-items: center;
`

const Checkbox = styled.input.attrs({type: 'checkbox'})`
  width: 30px;
  height: 30px;
  cursor: pointer;
`

const CheckboxContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding-left: 40px;
  padding-right: 40px;
`

const DataTable = styled.div`
    display: grid;
    grid-template-columns: 10px repeat(5, 200px);
    // grid-template-columns: 100px repeat(10, 200px); // use this when simulating rebalance
    grid-row-gap: 4px;
    flex: 4;
`

const TextContainer = styled.div`
  
`


const Text = styled.div`
  font-size: 18px;
  font-weight: 400;
  margin-left: 10px;
`

const TextLabel = styled.div`
  font-size: 18px;
  font-weight: 500;
  display: flex;
  flex-direction: row;
`

const InstructionsText = styled.div`
  font-size: 18px;
  font-weight: 400;
`

const TableHeaderRightAlign = styled.div`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  text-align: right;
  border-bottom: 2px solid black;
`
