import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Checkbox from '@material-ui/core/Checkbox'
import EnhancedTableHead from './EnhancedTableHead'
import Star from '@material-ui/icons/Star'
import StarBorder from '@material-ui/icons/StarBorder'
// import EnhancedTableToolbar from './EnhancedTableToolbar';
import io from 'socket.io-client'
import { Subscribe } from 'unstated'
import { TableContainer, tableContainer } from '../../state'

function stableSort(array, cmp) {
	const stabilizedThis = array.map((el, index) => [el, index])
	stabilizedThis.sort((a, b) => {
		const order = cmp(a[0], b[0])
		if (order !== 0) return order
		return a[1] - b[1]
	})
	return stabilizedThis.map(el => el[0])
}

function desc(a, b, orderBy) {
	if (b[orderBy] < a[orderBy]) {
		return -1
	}
	if (b[orderBy] > a[orderBy]) {
		return 1
	}
	return 0
}

function getSorting(order, orderBy) {
	return order === 'desc'
		? (a, b) => desc(a, b, orderBy)
		: (a, b) => -desc(a, b, orderBy)
}

const styles = theme => ({
	root: {
		width: '100%',
		marginTop: theme.spacing.unit * 3,
	},
	table: {
		minWidth: 1020,
	},
	tableWrapper: {
		overflowX: 'auto',
	},
})

class EnhancedTable extends React.Component {
	// state = {
	// 	order: 'desc',
	// 	orderBy: 'quoteVolume',
	// 	selected: [],
	// 	data: [],
	// 	page: 0,
	// 	rowsPerPage: 0,
	// }

	componentDidMount() {
		const socket = io.connect('http://localhost:3000')
		socket.on('data', data => {
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
			tableContainer.updateState(state => {
				state.data = converted
				state.rowsPerPage = state.rowsPerPage || converted.length
				return state
			})
		})
	}

	handleRequestSort = (event, property) => {
		const orderBy = property
		let order = 'desc'

		if (
			tableContainer.state.orderBy === property &&
			tableContainer.state.order === 'desc'
		) {
			order = 'asc'
		}

		tableContainer.updateState({ order, orderBy })
	}

	// handleSelectAllClick = event => {
	// 	if (event.target.checked) {
	// 		tableContainer.updateState(state => ({ selected: state.data.map(n => n.id) }))
	// 		return
	// 	}
	// 	tableContainer.updateState({ selected: [] })
	// }

	handleClick = (event, id) => {
		const { selected } = tableContainer.state
		const selectedIndex = selected.indexOf(id)
		let newSelected = []

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id)
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1))
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1))
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1)
			)
		}

		tableContainer.updateState({ selected: newSelected })
	}

	handleChangePage = (event, page) => {
		tableContainer.updateState({ page })
	}

	handleChangeRowsPerPage = event => {
		tableContainer.updateState({ rowsPerPage: event.target.value })
	}

	isSelected = id => tableContainer.state.selected.indexOf(id) !== -1

	render() {
		return (
			<Subscribe to={[TableContainer]}>
				{table => {
					const { classes } = this.props
					const {
						data,
						order,
						orderBy,
						// selected,
						rowsPerPage,
						page,
					} = table.state
					const emptyRows =
						rowsPerPage -
						Math.min(rowsPerPage, data.length - page * rowsPerPage)
					return (
						<Paper className={classes.root}>
							{/* <EnhancedTableToolbar numSelected={selected.length} /> */}
							<div className={classes.tableWrapper}>
								<Table className={classes.table} aria-labelledby='tableTitle'>
									<EnhancedTableHead
										// numSelected={selected.length}
										order={order}
										orderBy={orderBy}
										// onSelectAllClick={this.handleSelectAllClick}
										onRequestSort={this.handleRequestSort}
										// rowCount={data.length}
									/>
									<TableBody>
										{stableSort(data, getSorting(order, orderBy))
											.slice(
												page * rowsPerPage,
												page * rowsPerPage + rowsPerPage
											)
											.map(n => {
												const isSelected = this.isSelected(n.id)
												return (
													<TableRow
														hover
														// onClick={event => this.handleClick(event, n.id)}
														role='checkbox'
														aria-checked={isSelected}
														tabIndex={-1}
														key={n.id}
														selected={isSelected}>
														<TableCell padding='checkbox'>
															<Checkbox
																onClick={event => this.handleClick(event, n.id)}
																checked={isSelected}
																icon={<StarBorder />}
																checkedIcon={<Star />}
															/>
														</TableCell>
														<TableCell
															component='th'
															scope='row'
															padding='none'>
															{n.symbol}
														</TableCell>
														<TableCell align='right'>
															{n.close.toFixed(6)}
														</TableCell>
														<TableCell align='right'>
															{n.percentChange.toFixed(2) + '%'}
														</TableCell>
														<TableCell align='right'>
															{n.high.toFixed(6)}
														</TableCell>
														<TableCell align='right'>
															{n.low.toFixed(6)}
														</TableCell>
														<TableCell align='right'>
															{n.quoteVolume.toFixed(6)}
														</TableCell>
													</TableRow>
												)
											})}
										{emptyRows > 0 && (
											<TableRow style={{ height: 49 * emptyRows }}>
												<TableCell colSpan={6} />
											</TableRow>
										)}
									</TableBody>
								</Table>
							</div>
							<TablePagination
								rowsPerPageOptions={[5, 10, 25, 50, 100, rowsPerPage]}
								component='div'
								count={data.length}
								rowsPerPage={rowsPerPage}
								page={page}
								backIconButtonProps={{
									'aria-label': 'Previous Page',
								}}
								nextIconButtonProps={{
									'aria-label': 'Next Page',
								}}
								onChangePage={this.handleChangePage}
								onChangeRowsPerPage={this.handleChangeRowsPerPage}
							/>
						</Paper>
					)
				}}
			</Subscribe>
		)
	}
}

EnhancedTable.propTypes = {
	classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(EnhancedTable)
