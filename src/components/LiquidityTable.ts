import React from 'react'
import styled from 'styled-components'

import usePrices from '../hooks/usePrices'

const StyledTokenHeader = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const LiquidityTable = ({}: {}) => {
  const { yfiPrice } = usePrices()
  return null // TODO: WTF WHY
}

export default LiquidityTable
