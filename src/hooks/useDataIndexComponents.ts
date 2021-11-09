import { useContext } from 'react'

import { DataIndexComponentsContext } from 'contexts/DataIndexComponents'

const useMviComponents = () => {
  return { ...useContext(DataIndexComponentsContext) }
}

export default useMviComponents