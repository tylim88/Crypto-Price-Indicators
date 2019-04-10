import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import styles from '../assets/css/Tabs'
import TabContainer from '../components/TabContainer/TabContainer'

class Indicators extends React.Component {
	state = {
		value: 0,
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
							<Tab label='Indicators' />
							<Tab label='Setting' />
						</Tabs>
						<div className={classes.grow} />
					</Toolbar>
				</AppBar>
				<TabContainer>{/* {something} */}</TabContainer>
			</div>
		)
	}
}

Indicators.propTypes = {
	classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Indicators)
