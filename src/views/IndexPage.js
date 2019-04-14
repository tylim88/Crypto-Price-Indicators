import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import InputBase from '@material-ui/core/InputBase'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import EnhancedTable from '../components/Table/EnhancedTable'
import SearchIcon from '@material-ui/icons/Search'
import { tableContainer } from '../state'
import styles from '../assets/css/Tabs'
import TabContainer from '../components/TabContainer/TabContainer'

const markets = [
	'favorites',
	'bnb_markets',
	'btc_markets',
	'alts_markets',
	'usd_markets',
]

class IndexPage extends React.Component {
	constructor(props) {
		super(props)
		tableContainer.readIndexDb()
		tableContainer.startDataStream()
	}
	state = {
		value: 2,
	}

	handleChange = (event, value) => {
		this.setState({ value })
	}

	render() {
		const { classes } = this.props
		const { value } = this.state

		return (
			<div className={classes.root}>
				<AppBar position='static'>
					<Toolbar>
						<Tabs value={value} onChange={this.handleChange}>
							<Tab label='✩ Favorite' />
							<Tab label='BNB Markets' />
							<Tab label='BTC Markets' />
							<Tab label='ALTS Markets' />
							<Tab label='USDⓈ Markets' />
						</Tabs>
						<div className={classes.grow} />
						<div className={classes.search}>
							<div className={classes.searchIcon}>
								<SearchIcon />
							</div>
							<InputBase
								onChange={event => {
									tableContainer.updateSearch(event.target.value.toUpperCase())
								}}
								placeholder='Search…'
								classes={{
									root: classes.inputRoot,
									input: classes.inputInput,
								}}
							/>
						</div>
					</Toolbar>
				</AppBar>
				<TabContainer>
					<EnhancedTable markets={markets[value]} />
				</TabContainer>
			</div>
		)
	}
}

IndexPage.propTypes = {
	classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(IndexPage)
