import styled from 'styled-components'
import Box from '@mui/material/Box'
import { ChangeEvent, useState, useEffect, useContext } from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { createFilterOptions } from '@mui/material/Autocomplete'
// import LiquidityTable from 'components/LiquidityTable'
import useDpiIndexComponents from 'hooks/useDpiIndexComponents'
import useMviIndexComponents from 'hooks/useMviIndexComponents'
import useBedIndexComponents from 'hooks/useBedIndexComponents'
import useDataIndexComponents from 'hooks/useDataIndexComponents'
import { format } from 'util'
import IndexComponent from 'components/IndexComponent'
import { PRICE_DECIMALS, TEN_POW_18, EXCHANGES, INDEX_TOKENS } from 'utils/constants/constants'
import { getMaxTrade, getLiquidity, ExchangeName } from 'utils/poolData'
import { TokenContext } from 'contexts/Token'
import { BigNumber } from 'ethers'
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
// type IndexComponentObject = {
//   name: string,
//   symbol: string,
//   percentOfSet: string,
//   dailyPercentChange: string,
// // }
// interface IndexComponents {
//   [key: string]: IndexComponent
// }
const IndexLiquidityTab = (props: props) => {
  const [shouldSimulateRebalance, setShouldSimulateRebalance] = useState(false)
  const [selectedToken, setSelectedToken] = useState('')
  // const { selectedToken, setSelectedToken } = useContext(TokenContext)

  const [isLoading, setIsLoading] = useState(false)
  const [tradeError, setTradeError] = useState(false)

  const bedComponents = useBedIndexComponents().components
  const dataComponents = useDataIndexComponents().components
  const dpiComponents = useDpiIndexComponents().components
  const mviComponents = useMviIndexComponents().components

  // const INDEX_TOKEN_COMPONENTS: IndexComponents = {
  //   BED: bedComponents,
  //   DATA: dataComponents,
  //   DPI: dpiComponents,
  //   MVI: mviComponents
  // }

  // let gridTemplateColumns = shouldSimulateRebalance
    // ? '100px repeat(10, 155px);'
    // : '100px repeat(10, 155px);'   

    // console.log('bed',bedComponents)
    // console.log('dpi',dpiComponents)
    // console.log('mvi',mviComponents)
    // console.log('data',dataComponents)
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
          <TableHeader key={index}>
            {title}
          </TableHeader>
        )
      })
    }
    return DATA_TABLE_HEADERS.map((title, index) => {
      return (
        <TableHeader key={index}>
          {title}
        </TableHeader>
      )
    })
  }
  
  // useEffect(() => {
    // setIsLoading(true)
    // getMaxTrade(selectedToken.address, ONE_PERCENT, props.exchange)
    //   .then((response) => {
    //     setMaxTrade(response.size)
    //     setTradeError(false)
    //   })
    //   .catch(() => {
    //     setTradeError(true)
    //   })
    //   .finally(() => setTradeLoading(false))
  // }, [props.exchange, selectedToken.address])
      
      // switch (selectedToken.name) {
      //   case 'BED':
      //     return formatDataTableRow(bedComponents) 
      //   case 'DATA':
      //     return formatDataTableRow(dataComponents) 
      //   case 'DPI':
      //     return formatDataTableRow(dpiComponents) 
      //   case 'MVI':
      //     return formatDataTableRow(mviComponents) 
      //   default:
      //     return null
      // }
  return (
    <TabContainer>
      <HeaderRow>
        <Autocomplete
          id='token-select'
          sx={{ width: 300 }}
          options={INDEX_TOKENS}
          autoHighlight
          // filterOptions={createFilterOptions({ 
              // stringify(option){
                  // return option.symbol + option.name
              // },
              // limit: 100 })}
          onChange={(_, value) => {
            console.log('value',_, value)
            if (value != null) setSelectedToken(value.name)
          }}
          getOptionLabel={(option) => option.name}
          // renderOption={(props, option) => (
          //   <Box
          //     component='li'
          //     sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
          //     {...props}
          //     key={option.address}
          //   >
          //     <img loading='lazy' width='20' src={option.logoURI} alt='' />
          //     {option.name} ({option.symbol}) - {option.address}
          //   </Box>
          // )}
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
      
      <DataTable>
        {renderDataTableHeaders()}

        {
          bedComponents?.map((component, index) => <IndexLiquidityDataTableRow component={component} key={index} />)
        }

        {/* {
          bedComponents
              
            : null
        } */}
        {/* {renderDataTable()} */}
        
        
        {/* {exchanges.map((exchange) => ( */}
          {/* <ExchangeSummary
            tokenPrice={tokenPrice}
            exchange={exchange}
            key={exchange}
            desiredAmount={props.desiredAmount}
          />
        ))} */}

      </DataTable>
    </TabContainer>
  )
}

export default IndexLiquidityTab

const TabContainer = styled.div`
  display: flex;
  flex: 10;
  align-items: flex-start;
  flex-direction: column;
  justify-content: space-around;
` 

const HeaderRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex: 1;
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
    grid-template-columns: 100px repeat(5, 155px);;
    // grid-template-columns: 100px repeat(10, 155px);;
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

const TableHeader = styled.div`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  border-bottom: 2px solid black;
  // padding-right: 10px;
`

const TableHeaderRightAlign = styled.div`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  text-align: right;
  border-bottom: 2px solid black;
`
