import { Container } from 'unstated'
import io from 'socket.io-client'

class TableContainer extends Container {
	state = {
		order: 'desc',
		orderBy: 'quoteVolume',
		selected: [],
		data: [],
		page: 0,
		rowsPerPage: 0,
		socket: {},
	}

	startDataStream() {
		this.state.socket = io.connect('http://localhost:3000')
		this.state.socket.on('data', data => {
			const coins = Object.entries(data.binance.btc_markets)
			// very weird thing happen here, coin already converted to numeric
			const converted = coins.map(coin => {
				for (var prop in coin[1]) {
					if (prop !== 'symbol') {
						coin[1][prop] = parseFloat(coin[1][prop])
					}
				}
				coin[1].id = coin[1].symbol
				coin = coin[1]
				return coin
			})
			this.setState(state => {
				state.data = converted
				state.rowsPerPage = state.rowsPerPage || converted.length
				return state
			})
		})
	}
	updateState(obj) {
		this.setState(obj)
	}
}

export default TableContainer
