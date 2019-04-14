import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import styles from '../assets/css/Tabs'
import TabContainer from '../components/TabContainer/TabContainer'
import socket from '../api/websocket'

class ChartPage extends React.Component {
	state = {
		value: 0,
		period: '1m',
		pair: '',
	}

	handleChange = (event, value) => {
		this.setState({ value })
	}

	componentDidMount = () => {
		const {
			state: { period },
			props: {
				location: { pathname },
				match: { path },
			},
		} = this
		this.pair = pathname.replace(`${path}/`, '').replace('-', '')
		socket.emit('room', {
			join: true,
			pair: this.pair,
			period,
		})

		// const roomName = `${'ETH/BTC'.replace('/', '')}@${'1m'}`
		// socket.on(roomName, chart => {
		// 	console.log(chart)
		// })
		// setTimeout(() => {

		// }, 10000)
	}

	componentWillUnmount = () => {
		console.log('1')
		const {
			state: { period, pair },
		} = this
		socket.emit('room', {
			join: false,
			pair,
			period,
		})
	}

	render() {
		const {
			state: { value },
			props: { classes },
		} = this

		return (
			<div className={classes.root}>
				<AppBar position='static'>
					<Toolbar>
						<Tabs value={value} onChange={this.handleChange}>
							<Tab label='Charts' />
							<Tab label='Setting' />
						</Tabs>
						<div className={classes.grow} />
					</Toolbar>
				</AppBar>
				<TabContainer>{'something'}</TabContainer>
			</div>
		)
	}
}

ChartPage.propTypes = {
	classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(ChartPage)
