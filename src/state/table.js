import { Container } from 'unstated'
import io from 'socket.io-client'
import localForage from 'localforage'

class TableContainer extends Container {
	state = {
		order: 'desc',
		orderBy: 'quoteVolume',
		// selected:[],
		favorite: {
			binance: {
				bnb_markets: [],
				btc_markets: [],
				eth_markets: [],
				usd_markets: [],
			},
		},
		data: {
			binance: {
				favorites: [],
				bnb_markets: [],
				btc_markets: [],
				eth_markets: [],
				usd_markets: [],
			},
		},
		filteredData: {
			binance: {
				favorites: [],
				bnb_markets: [],
				btc_markets: [],
				eth_markets: [],
				usd_markets: [],
			},
		},
		page: {
			binance: {
				favorites: 0,
				bnb_markets: 0,
				btc_markets: 0,
				eth_markets: 0,
				usd_markets: 0,
			},
		},
		rowsPerPage: {
			binance: {
				favorites: 0,
				bnb_markets: 0,
				btc_markets: 0,
				eth_markets: 0,
				usd_markets: 0,
			},
		},
		socket: {},
	}

	readIndexDb = () => {
		localForage.getItem('favorite').then(res => {
			this.state.favorite = JSON.parse(res)
		})
	}

	startDataStream = () => {
		this.state.socket = io.connect(process.env.REACT_APP_SERVER_URL)
		this.state.socket.on('data', data => {
			for (let markets in data.binance) {
				const pairs = Object.entries(data.binance[markets])
				// very weird thing happen here, pair already converted to numeric
				this.state.data.binance[markets] = pairs.map(pair => {
					for (let prop in pair[1]) {
						if (prop !== 'symbol') {
							pair[1][prop] = parseFloat(pair[1][prop])
						}
					}
					pair[1].id = pair[1].symbol
					pair = pair[1]
					return pair
				})
				this.state.rowsPerPage.binance[markets] =
					this.state.rowsPerPage.binance[markets] ||
					this.state.data.binance[markets].length
			}

			this.setState({})
		})
	}
	updateSearch = value => {
		for (let markets in this.state.data.binance) {
			this.state.filteredData.binance[markets] = this.state.data.binance[
				markets
			].filter(coin => {
				return coin.symbol.includes(value)
			})
			this.state.rowsPerPage.binance[markets] = this.state.filteredData.binance[
				markets
			].length
		}
		this.setState({})
	}
}

export default TableContainer
