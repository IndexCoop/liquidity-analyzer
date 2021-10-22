import { BigNumber } from 'ethers'
import numeral from 'numeral'
import styled from 'styled-components'

const TableRow = (props: { symbol: string; liquidity: BigNumber }) => {
  // use math.abs so numeral formats negative numbers without '-' for design spec
  // const percentChange = numeral(
  //   Math.abs(parseFloat(dailyPercentChange))
  // ).format('0.00')

  const formattedPriceUSD = numeral(props.liquidity).format('$0,0.00')

  return (
    <div>
      <StyledNameColumn>
        <StyledTableData>{props.symbol}</StyledTableData>
      </StyledNameColumn>

      <StyledTableData>{formattedPriceUSD}</StyledTableData>
    </div>
  )
}

const StyledNameColumn = styled.span`
  font-weight: 600;
`

const StyledTableHeader = styled.p`
  margin: 0;
  font-size: 12px;
`

const StyledTokenLogo = styled.img`
  width: 100%;
  height: auto;
  border-radius: 50%;
`

const StyledTableData = styled(StyledTableHeader)`
  font-size: 16px;
  line-height: 24px;
`

export default TableRow
