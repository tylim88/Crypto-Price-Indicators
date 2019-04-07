import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import EnhancedTable from '../Table/EnhancedTable'
import { tableContainer } from '../../state'

function TabContainer(props) {
	return (
		<Typography component='div' style={{ padding: 8 * 3 }}>
			{props.children}
		</Typography>
	)
}

TabContainer.propTypes = {
	children: PropTypes.node.isRequired,
}

const styles = theme => ({
	root: {
		flexGrow: 1,
		backgroundColor: theme.palette.background.paper,
	},
})

class SimpleTabs extends React.Component {
	constructor(props) {
		super(props)
		tableContainer.startDataStream()
	}
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
					<Tabs value={value} onChange={this.handleChange}>
						<Tab label='✩ Favourite' />
						<Tab label='BNB Markets' />
						<Tab label='BTC Markets' />
						<Tab label='ALTS Markets' />
						<Tab label='USDⓈ Markets' />
					</Tabs>
				</AppBar>
				{value === 0 && (
					<TabContainer>
						<EnhancedTable />
					</TabContainer>
				)}
				{value === 1 && <TabContainer>Item Two</TabContainer>}
				{value === 2 && <TabContainer>Item Three</TabContainer>}
				{value === 3 && <TabContainer>Item Four</TabContainer>}
				{value === 4 && <TabContainer>Item Five</TabContainer>}
			</div>
		)
	}
}

SimpleTabs.propTypes = {
	classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(SimpleTabs)
