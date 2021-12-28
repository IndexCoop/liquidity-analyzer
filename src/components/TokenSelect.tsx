import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { createFilterOptions } from '@mui/material/Autocomplete'
import { MainnetTokens, MaticTokens } from '@indexcoop/tokenlists'
import { useEffect, useState, useContext, ChangeEvent } from 'react'
import { MarketDataContext } from 'contexts/MarketData'
import { ChainId } from '../utils/constants/constants'

function getTokenDataForSymbol(tokenSymbol: string, chainId: ChainId) {
  const tokens = chainId === ChainId.ethereum ? MainnetTokens : MaticTokens
  const filteredTokens = tokens.filter(
    (tokenData) => tokenData.symbol === tokenSymbol
  )
  return filteredTokens.length > 0 ? filteredTokens[0] : null
}

export default function TokenSelect(props: {
  chainId: ChainId
  desiredAmount: string
  onDesiredAmountChange: (arg0: ChangeEvent<HTMLInputElement>) => void
}) {
  const [tokens, setTokens] = useState<TokenData[]>([])
  const { selectedToken, setSelectedToken } = useContext(MarketDataContext)

  useEffect(() => {
    const tokens =
      props.chainId === ChainId.ethereum ? MainnetTokens : MaticTokens
    const tokenData = getTokenDataForSymbol(selectedToken.symbol, props.chainId)
    setTokens(tokens)

    if (tokenData === null) {
      return
    }

    if (tokenData.address === selectedToken.address) {
      return
    }

    setSelectedToken(tokenData)
  }, [
    props.chainId,
    selectedToken.symbol,
    selectedToken.address,
    setSelectedToken,
  ])

  return (
    <Autocomplete
      id='token-select'
      sx={{ width: 300 }}
      options={tokens}
      autoHighlight
      filterOptions={createFilterOptions({
        stringify(option) {
          return option.symbol + option.name
        },
        limit: 100,
      })}
      onChange={(_, value) => {
        if (value != null) setSelectedToken(value)
      }}
      getOptionLabel={(option) => option.name}
      renderOption={(props, option) => (
        <Box
          component='li'
          sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
          {...props}
          key={option.address}
        >
          <img loading='lazy' width='20' src={option.logoURI} alt='' />
          {option.name} ({option.symbol}) - {option.address}
        </Box>
      )}
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
  )
}

export interface TokenData {
  chainId: number
  address: string
  name: string
  symbol: string
  decimals: number
  logoURI: string
}
