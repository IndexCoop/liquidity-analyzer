import { camelCase } from 'lodash'
import { ALL_INDEX_SET_HTML_REFS } from 'utils/constants/constants'
import IndexComponent from 'components/IndexComponent'

const tokensetsUrl = process.env.REACT_APP_TOKENSETS_URL

export const fetchSetComponents = (set: string) => {
  const requestUrl = `${tokensetsUrl}/public/v2/portfolios/${set}`
  return fetch(requestUrl)
    .then((response) => response.json())
    .then((response) => {
      if (!response?.portfolio?.components) {
        // undocumented API endpoint. Throw error if not expected response format
        throw new Error('Invalid API response from Set Protocol service')
      }
      const {
        portfolio: { components },
      } = response

      return formatComponents(components)
    })
    .catch((error) => console.log(error))
}

function formatComponents(components: any) {
  return components.map((component: any) => {
    const camelCasedComponent = Object.keys(component).reduce(
      (comp: any, k: string) => ({
        ...comp,
        [camelCase(k)]: component[k],
      }),
      {}
    )
    return camelCasedComponent
  })
}

export const fetchMarketCap = async (selectedIndex: string) => {
  const requestUrl = `https://api.coingecko.com/api/v3/coins/markets?` +
  `vs_currency=usd&` +
  `ids=${ALL_INDEX_SET_HTML_REFS[selectedIndex]}&` +
  `order=market_cap_desc&` +
  `per_page=100&` +
  `page=1&` +
  `sparkline=false`

  return fetch(requestUrl)
    .then((response) => response.json())
    .then((response) => {
      console.log(response[0])
      return response[0].market_cap
    })
    .catch(console.error)
}

export const fetchTotalMarketCap = async () => {
  interface SetData {
    market_cap: number
  }
  const formattedParams = Object.values(ALL_INDEX_SET_HTML_REFS)
    .toString()
    .replace(/,/g, "%2C")
  const requestUrl = `https://api.coingecko.com/api/v3/coins/markets?` +
    `vs_currency=usd&` +
    `ids=${formattedParams}&` +
    `order=market_cap_desc&` +
    `per_page=100&` +
    `page=1&` +
    `sparkline=false`
  return fetch(requestUrl)
    .then((response) => response.json())
    .then((response) => {
      let totalMarketCap = 0
      response.forEach((setData: SetData) => {
        totalMarketCap += setData.market_cap
      });
      return totalMarketCap;
    })
    .catch(console.error)
}