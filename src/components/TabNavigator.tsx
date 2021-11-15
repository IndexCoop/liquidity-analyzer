import { MouseEvent } from 'react'
import styled from 'styled-components'

interface props {
  activeTab: string,
  onActiveTabChange: (e: MouseEvent) => void,
  tabs: { tokenLiquidity: string; indexLiquidity: string; }
}

const TabNavigator = (props: props) => {
  const renderTabs = () => {
    const tabs = Object.values(props.tabs).map((item, index) => {
      return (
        <Tab 
          key={index}
          onClick={props.onActiveTabChange}
          style={props.activeTab === item ? activeStyle : undefined}
        >
          {item}
        </Tab>
      )    
    })
    return tabs
  } 

  return (
    <Wrapper>
      <TabContainer>
        {renderTabs()}
      </TabContainer>
    </Wrapper>
  )
}

export default TabNavigator;

const activeStyle = {
  backgroundColor: 'rgba(100, 100, 200, 0.3)'
}

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: flex-end;
`
const TabContainer = styled.div`
  display: flex;
  justifiy-content: flex-start; 
  flex-direction: row;
`

const Tab = styled.div`
  padding: 10px;
  border: 2px solid black;
  border-bottom-width: 4px;
  transition: .2s;
  cursor: pointer;
  font-size: 18px;

  &:hover {
    transition: .2s;
    background-color: rgba(100, 100, 200, 0.3);
  }
`