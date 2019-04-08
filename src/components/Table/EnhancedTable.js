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
import { Subscribe } from 'unstated'
import { TableContainer, tableContainer } from '../../state'
import localForage from 'localforage'

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
		// marginTop: theme.spacing.unit * 3,
		marginTop: 0,
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

	handleRequestSort = (event, property) => {
		const orderBy = property
		let order = 'desc'

		if (
			tableContainer.state.orderBy === property &&
			tableContainer.state.order === 'desc'
		) {
			order = 'asc'
		}

		tableContainer.setState({ order, orderBy })
	}

	// handleSelectAllClick = event => {
	// 	if (event.target.checked) {
	// 		tableContainer.setState(state => ({ selected: state.data.map(n => n.id) }))
	// 		return
	// 	}
	// 	tableContainer.setState({ selected: [] })
	// }

	handleClick = (event, id) => {
		// const { selected } = tableContainer.state
		// const selectedIndex = selected.indexOf(id)
		// let newSelected = []

		// if (selectedIndex === -1) {
		// 	newSelected = newSelected.concat(selected, id)
		// } else if (selectedIndex === 0) {
		// 	newSelected = newSelected.concat(selected.slice(1))
		// } else if (selectedIndex === selected.length - 1) {
		// 	newSelected = newSelected.concat(selected.slice(0, -1))
		// } else if (selectedIndex > 0) {
		// 	newSelected = newSelected.concat(
		// 		selected.slice(0, selectedIndex),
		// 		selected.slice(selectedIndex + 1)
		// 	)
		// }

		// tableContainer.setState({ selected: newSelected })
		const favorite = tableContainer.state.favorite.binance
		const markets = this.props.markets
		if (event.target.checked) {
			favorite[markets].push(id)
		} else {
			for (var i = 0; i < favorite[markets].length; i++) {
				if (favorite[markets][i] === id) {
					favorite[markets].splice(i, 1)
				}
			}
		}
		localForage.setItem(
			'favorite',
			JSON.stringify(tableContainer.state.favorite)
		)
	}

	handleChangePage = (event, page) => {
		tableContainer.setState(state => {
			state.page.binance[this.props.markets] = page
			return state
		})
	}

	handleChangeRowsPerPage = event => {
		tableContainer.setState(state => {
			state.rowsPerPage.binance[this.props.markets] = event.target.value
			return state
		})
	}

	// isSelected = id => tableContainer.state.selected.indexOf(id) !== -1

	render() {
		return (
			<Subscribe to={[TableContainer]}>
				{table => {
					const { classes, markets } = this.props
					const {
						data: { binance },
						order,
						orderBy,
						// selected,
						rowsPerPage: { binance: rowsPerPageBinance },
						page,
						filteredData: { binance: filteredBinance },
					} = table.state
					const list =
						(filteredBinance[markets].length && filteredBinance[markets]) ||
						binance[markets]
					{
						/* const emptyRows =
						rowsPerPageBinance[markets] -
						Math.min(
							rowsPerPageBinance[markets],
							list.length -
								page.list * rowsPerPageBinance[markets]
						) */
					}
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
										{stableSort(list, getSorting(order, orderBy))
											.slice(
												page.binance[markets] * rowsPerPageBinance[markets],
												page.binance[markets] * rowsPerPageBinance[markets] +
													rowsPerPageBinance[markets]
											)
											.map(n => {
												{
													/* const isSelected = this.isSelected(n.id) */
												}
												return (
													<TableRow
														hover
														// onClick={event => this.handleClick(event, n.id)}
														role='checkbox'
														// aria-checked={isSelected}
														tabIndex={-1}
														key={n.id}
														// selected={isSelected}
													>
														<TableCell padding='checkbox'>
															<Checkbox
																onClick={event => this.handleClick(event, n.id)}
																// checked={isSelected}
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
										{/*emptyRows > 0 && (
											<TableRow style={{ height: 49 * emptyRows }}>
												<TableCell colSpan={6} />
											</TableRow>
										)*/}
									</TableBody>
								</Table>
							</div>
							<TablePagination
								rowsPerPageOptions={[5, 10, 25, 50, 100, list.length]}
								component='div'
								count={list.length}
								rowsPerPage={rowsPerPageBinance[markets]}
								page={page.binance[markets]}
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
	markets: PropTypes.string.isRequired,
}

export default withStyles(styles)(EnhancedTable)
