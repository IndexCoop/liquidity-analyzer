import numeral from 'numeral'

export const formatDisplay = (value: number) => numeral(value).format('0,0.00')
export const formatUSD = (value: number) => numeral(value).format('$0,0.00')