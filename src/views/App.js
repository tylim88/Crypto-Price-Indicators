import React, { Component } from 'react'
import { Table } from '../components'
import request from 'superagent'
// fetch('https://api.binance.com/api/v1/ping')
// 	.then(res => res.json())
// 	.then(console.log)
request
	.get('https://api.binance.com/api/v1/ping')
	.then(res => console.log(res.body))

class App extends Component {
	render() {
		return <Table />
	}
}

export default App
