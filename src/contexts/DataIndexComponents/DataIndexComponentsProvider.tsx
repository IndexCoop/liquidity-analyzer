import React, { useState, useEffect } from 'react'
import DataIndexComponentsContext from './DataIndexComponentsContext'
import { fetchSetComponents } from 'utils/tokensetsApi'

const DataIndexComponentsProvider: React.FC = ({ children }) => {
  const [dataIndexComponents, setDataIndexComponents] = useState<any>([])

  useEffect(() => {
    fetchSetComponents('data')
      .then((response: any) => {
        setDataIndexComponents(response)
      })
      .catch((error: any) => console.log(error))
  }, [])

  return (
    <DataIndexComponentsContext.Provider
      value={{ components: dataIndexComponents }}
    >
      {children}
    </DataIndexComponentsContext.Provider>
  )
}

export default DataIndexComponentsProvider
