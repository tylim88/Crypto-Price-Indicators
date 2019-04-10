import { Container } from 'unstated'
import io from 'socket.io-client'
import localForage from 'localforage'
const { nameM } = require('crypto-symbol')

class TableContainer extends Container {
	state = {
		order: 'desc',
		orderBy: 'quoteVolume',
		// selected:[],
		favorite: {
			binance: [],
		},
		data: {
			binance: {
				bnb_markets: [],
				btc_markets: [],
				alts_markets: [],
				usd_markets: [],
				favorites: [],
			},
		},
		filteredData: {
			binance: {
				bnb_markets: [],
				btc_markets: [],
				alts_markets: [],
				usd_markets: [],
				favorites: [],
			},
		},
		page: {
			binance: {
				bnb_markets: 0,
				btc_markets: 0,
				alts_markets: 0,
				usd_markets: 0,
				favorites: 0,
			},
		},
		rowsPerPage: {
			binance: {
				bnb_markets: 'Max',
				btc_markets: 'Max',
				alts_markets: 'Max',
				usd_markets: 'Max',
				favorites: 'Max',
			},
		},
		socket: {},
	}

	readIndexDb = () => {
		localForage.getItem('favorite').then(res => {
			if (res) {
				const parsed = JSON.parse(res)
				if (!parsed.binance.length) {
					localForage.removeItem('favorite')
				} else {
					this.state.favorite = parsed
				}
			}
		})
	}

	startDataStream = () => {
		this.state.socket = io.connect(process.env.REACT_APP_SERVER_URL)
		this.state.socket.on('data', data => {
			this.state.data.binance.favorites = []
			for (let markets in data.binance) {
				if (markets !== 'favorites') {
					const pairs = Object.entries(data.binance[markets])
					// very weird thing happen here, pair already converted to numeric
					this.state.data.binance[markets] = pairs.map(pair => {
						for (let prop in pair[1]) {
							if (prop !== 'symbol') {
								pair[1][prop] = parseFloat(pair[1][prop])
							}
						}
						pair = pair[1]
						pair.id = pair.symbol
						pair.name = nameM(pair.symbol.split('/')[0])

						if (this.state.favorite.binance.indexOf(pair['symbol']) !== -1) {
							pair.favorite = true
							this.state.data.binance.favorites.push(pair)
						} else {
							pair.favorite = false
						}
						return pair
					})
				}
			}
			this.setState({}) // wont render without argument
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
