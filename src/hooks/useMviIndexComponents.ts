import { useContext } from 'react'

import { MviIndexComponentsContext } from 'contexts/MviIndexComponents'

const useMviComponents = () => {
  return { ...useContext(MviIndexComponentsContext) }
}

export default useMviComponents
