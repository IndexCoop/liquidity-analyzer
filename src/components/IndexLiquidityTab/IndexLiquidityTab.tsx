import styled from 'styled-components'
import { ChangeEvent, useState, useEffect, useMemo } from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'

import useMarketDataComponents from 'hooks/useMarketDataComponents'
import IndexComponent from 'components/IndexComponent'
import {
  INDEX_TOKENS,
  INDEX_TOKENS_FOR_SELECT,
} from 'utils/constants/constants'
import IndexLiquidityDataTableRow from './IndexLiquidityDataTableRow'
import IndexLiquiditySimulateDataTableRow from './IndexLiquiditySimulateDataTableRow'
import { fetchMarketCap, fetchTotalMarketCap } from 'utils/tokensetsApi'
import { formatUSD } from 'utils/formatters'

interface props {
  desiredAmount: string
  onDesiredAmountChange: (arg0: ChangeEvent<HTMLInputElement>) => void
}

interface DataTableProps {
  isSimulated?: boolean
}
interface TableTotalProps {
  align?: 'left' | 'right'
}

interface TableTotalWeightProps {
  weight?: string
}

const DOLLAR_PER_GAS = 1.3

const DATA_TABLE_HEADERS = [
  'Component',
  'Weight %',
  'Slippage Allowed',
  'Best Exchange',
  'Max Trade Size (Units)',
  'Max Trade Size ($)',
]
const DATA_TABLE_SIMULATION_HEADERS = [
  'Component',
  'Weight %',
  'Target %',
  '% Change',
  '$ Change',
  'Slippage Allowed',
  'Best Exchange',
  'Max Trade Size (Units)',
  'Max Trade Size ($)',
  'No. of Trades',
  'Estimated Cost',
]
const IndexLiquidityTab = (props: props) => {
  const [totalWeight, setTotalWeight] = useState<string>()
  const [targetWeight, setTargetWeight] = useState<string>()
  const [shouldSimulateRebalance, setShouldSimulateRebalance] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState('')
  const [selectedIndexMarketCap, setSelectedIndexMarketCap] = useState(0)
  const [totalMarketCap, setTotalMarketCap] = useState(0)
  const [netAssetValue, setNetAssetValue] = useState(0)
  const { bedComponents, dataComponents, dpiComponents, mviComponents } =
    useMarketDataComponents()
  const [gasCost, setGasCost] = useState('')

  const onGasCostChange = (e: ChangeEvent<HTMLInputElement>) => {
    setGasCost(e.target.value)
  }

  const setComponents: any = useMemo(
    () => ({
      BED: bedComponents,
      DATA: dataComponents,
      DPI: dpiComponents,
      MVI: mviComponents,
    }),
    [bedComponents, dataComponents, dpiComponents, mviComponents]
  )
  useEffect(() => {
    fetchTotalMarketCap()
      .then((response: any) => {
        setTotalMarketCap(response)
      })
      .catch((error: any) => console.log(error))
  }, [])

  useEffect(() => {
    if (selectedIndex) {
      fetchMarketCap(selectedIndex)
        .then((response: any) => {
          setSelectedIndexMarketCap(response)
        })
        .catch((error: any) => console.log(error))
    }
  }, [selectedIndex])

  useEffect(() => {
    const tokenData = setComponents[selectedIndex]
    const netAssetValueReducer = (
      netAssetValue: number,
      component: IndexComponent
    ): number => {
      return netAssetValue + (parseFloat(component.totalPriceUsd) || 0)
    }
    const getNetAssetValue = () => {
      return tokenData ? tokenData.reduce(netAssetValueReducer, 0) : 0
    }
    const sumOfWeight = tokenData
      ?.map((token: any) => parseFloat(token.percentOfSet))
      .reduce((prev: number, next: number) => prev + next)
    setTotalWeight(sumOfWeight?.toFixed(2))
    setNetAssetValue(getNetAssetValue())
  }, [selectedIndex])

  const RebalanceCheckbox = () => {
    return (
      <CheckboxContainer>
        <Checkbox
          checked={shouldSimulateRebalance}
          onChange={() => setShouldSimulateRebalance(!shouldSimulateRebalance)}
        />
        <Text
          onClick={() => setShouldSimulateRebalance(!shouldSimulateRebalance)}
        >
          Simulate Rebalance
        </Text>
      </CheckboxContainer>
    )
  }

  const renderDataTableHeaders = () => {
    if (shouldSimulateRebalance) {
      return DATA_TABLE_SIMULATION_HEADERS.map((title, index) => {
        return (
          <TableHeaderRightAlign key={index}>{title}</TableHeaderRightAlign>
        )
      })
    }
    return DATA_TABLE_HEADERS.map((title, index) => {
      return <TableHeaderRightAlign key={index}>{title}</TableHeaderRightAlign>
    })
  }
  const setTargetPercent = (
    targetPercent: string,
    component: IndexComponent
  ) => {
    setTargetWeight(
      (
        parseFloat(totalWeight!) -
        parseFloat(component.percentOfSet) +
        parseFloat(targetPercent)
      ).toFixed(2)
    )
  }

  const renderComponentsDataTable = () => {
    const formatDataTableRow = (components: IndexComponent[]) => {
      if (shouldSimulateRebalance) {
        return components?.map((component, index) => (
          <IndexLiquiditySimulateDataTableRow
            selectedIndex={selectedIndex}
            tradeCost={parseFloat(gasCost) * DOLLAR_PER_GAS}
            component={component}
            key={index}
            updateTargetPercent={(value: string) =>
              setTargetPercent(value, component)
            }
          />
        ))
      }

      return components?.map((component, index) => (
        <IndexLiquidityDataTableRow component={component} key={index} />
      ))
    }
    switch (selectedIndex) {
      case INDEX_TOKENS.BED:
        return formatDataTableRow(bedComponents!)
      case INDEX_TOKENS.DATA:
        return formatDataTableRow(dataComponents!)
      case INDEX_TOKENS.DPI:
        return formatDataTableRow(dpiComponents!)
      case INDEX_TOKENS.MVI:
        return formatDataTableRow(mviComponents!)
      default:
        return null
    }
  }
  const SelectAToken = () => {
    return (
      <TitleContainer>
        <Title>Select a token from the dropdown</Title>
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
            if (value != null) setSelectedIndex(value.name)
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
        <RebalanceCheckbox />
        <TextField
          value={gasCost}
          onChange={onGasCostChange}
          label='Gas Cost in Gwei'
          inputProps={{
            autoComplete: 'new-password', // disable autocomplete and autofill
          }}
        />

        <TextContainer>
          <TextLabel>
            Total Market Cap:
            <Text>{formatUSD(totalMarketCap)}</Text>
          </TextLabel>
          <hr />
          <TextLabel>
            Market Cap:
            <Text>{formatUSD(selectedIndexMarketCap)}</Text>
          </TextLabel>

          <TextLabel>
            Net Asset Value:
            <Text>{formatUSD(netAssetValue)}</Text>
          </TextLabel>
        </TextContainer>
      </HeaderRow>
      <InstructionContainer>
        <InstructionsText>
          Each component's data loads when you remove focus from its Slippage
          Allowed input.
        </InstructionsText>
      </InstructionContainer>

      <DataTable isSimulated={shouldSimulateRebalance}>
        {selectedIndex ? (
          <>
            {renderDataTableHeaders()}
            {renderComponentsDataTable()}
            <>
              <Tabletotal>Total</Tabletotal>

              <TableTotalWeight weight={totalWeight}>
                {totalWeight}
              </TableTotalWeight>

              <TableTotalWeight weight={targetWeight}>
                {targetWeight}
              </TableTotalWeight>
            </>
          </>
        ) : (
          <SelectAToken />
        )}
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
  top: 50%;
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
  flex: 0.2;
`

const InstructionContainer = styled.div`
  display: flex;
  margin-top: 10px;
  margin-bottom: 10px;
  align-items: center;
`

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
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

const DataTable = styled.div<DataTableProps>`
  display: grid;
  grid-template-columns: ${(prop) =>
    prop.isSimulated ? '100px repeat(10, 140px)' : '10px repeat(5, 200px)'};
  grid-row-gap: 4px;
  flex: 4;
`

const TextContainer = styled.div`
  padding-left: 35px;
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

const Tabletotal = styled.div<TableTotalProps>`
  display: flex;
  flex-direction: row;
  justify-content: ${({ align }) =>
    align && align === 'left' ? 'flex-start' : 'flex-end'};
  margin: 0;
  height: 60px;
  font-size: 18px;
  font-weight: 500;
`

const TableTotalWeight = styled(Tabletotal)<TableTotalWeightProps>`
  line-height: 24px;
  display: flex;
  justify-content: flex-end;
  color: ${({ weight }) => (weight && weight !== '100.00' ? 'red' : 'inherit')};
`
