import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { fade } from '@material-ui/core/styles/colorManipulator'
import Toolbar from '@material-ui/core/Toolbar'
import InputBase from '@material-ui/core/InputBase'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import EnhancedTable from '../Table/EnhancedTable'
import { tableContainer } from '../../state'
import SearchIcon from '@material-ui/icons/Search'

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
	grow: {
		flexGrow: 1,
	},
	search: {
		position: 'relative',
		borderRadius: theme.shape.borderRadius,
		backgroundColor: fade(theme.palette.common.white, 0.15),
		'&:hover': {
			backgroundColor: fade(theme.palette.common.white, 0.25),
		},
		marginLeft: 0,
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			marginLeft: theme.spacing.unit,
			width: 'auto',
		},
	},
	searchIcon: {
		width: theme.spacing.unit * 9,
		height: '100%',
		position: 'absolute',
		pointerEvents: 'none',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	inputRoot: {
		color: 'inherit',
		width: '100%',
	},
	inputInput: {
		paddingTop: theme.spacing.unit,
		paddingRight: theme.spacing.unit,
		paddingBottom: theme.spacing.unit,
		paddingLeft: theme.spacing.unit * 10,
		transition: theme.transitions.create('width'),
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			width: 120,
			'&:focus': {
				width: 200,
			},
		},
	},
})

class SimpleTabs extends React.Component {
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
									const value = event.target.value.toUpperCase()
									setTimeout(() => {
										tableContainer.updateSearch(value)
									})
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

				{value === 0 && (
					<TabContainer>
						<EnhancedTable markets={'favorites'} />
					</TabContainer>
				)}
				{value === 1 && (
					<TabContainer>
						<EnhancedTable markets={'bnb_markets'} />
					</TabContainer>
				)}
				{value === 2 && (
					<TabContainer>
						<EnhancedTable markets={'btc_markets'} />
					</TabContainer>
				)}
				{value === 3 && (
					<TabContainer>
						<EnhancedTable markets={'alts_markets'} />
					</TabContainer>
				)}
				{value === 4 && (
					<TabContainer>
						<EnhancedTable markets={'usd_markets'} />
					</TabContainer>
				)}
			</div>
		)
	}
}

SimpleTabs.propTypes = {
	classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(SimpleTabs)
