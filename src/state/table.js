import { Container } from 'unstated'
import io from 'socket.io-client'

class TableContainer extends Container {
	state = {
		order: 'desc',
		orderBy: 'quoteVolume',
		selected: [],
		data: {
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

	startDataStream() {
		this.state.socket = io.connect('http://localhost:3000')
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
	updateState(obj) {
		this.setState(obj)
	}
}

export default TableContainer
