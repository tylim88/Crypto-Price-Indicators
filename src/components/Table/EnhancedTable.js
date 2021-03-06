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
	let orderByA = a[orderBy]
	let orderByB = b[orderBy]

	if (typeof orderByA === 'string') {
		orderByA = orderByA.toUpperCase()
		orderByB = orderByB.toUpperCase()
	}
	if (orderByB < orderByA) {
		return -1
	}
	if (orderByB > orderByA) {
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

	handleClick = (event, n) => {
		n.favorite = !n.favorite
		const favorite = tableContainer.state.favorite.binance
		const favorites = tableContainer.state.data.binance.favorites
		if (event.target.checked) {
			favorite.push(n.symbol)
			favorites.push(n)
		} else {
			favorite.forEach((element, i, arr) => {
				if (element === n.symbol) {
					arr.splice(i, 1)
				}
			})

			favorites.forEach((element, i, arr) => {
				if (element.symbol === n.symbol) {
					arr.splice(i, 1)
				}
			})
		}
		tableContainer.setState({})
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

	render() {
		return (
			<Subscribe to={[TableContainer]}>
				{table => {
					const { classes, markets, history } = this.props
					const {
						data: { binance },
						order,
						orderBy,
						rowsPerPage,
						page: { binance: pageBinance },
						filteredData: { binance: filteredBinance },
					} = table.state
					const list =
						(filteredBinance[markets].length && filteredBinance[markets]) ||
						binance[markets]
					const rowsPerPageBinance =
						(rowsPerPage.binance[markets] === 'Max' && list.length) ||
						rowsPerPage.binance[markets]

					return (
						<Paper className={classes.root}>
							<div className={classes.tableWrapper}>
								<Table className={classes.table} aria-labelledby='tableTitle'>
									<EnhancedTableHead
										order={order}
										orderBy={orderBy}
										onRequestSort={this.handleRequestSort}
									/>
									<TableBody>
										{stableSort(list, getSorting(order, orderBy))
											.slice(
												pageBinance[markets] * rowsPerPageBinance,
												pageBinance[markets] * rowsPerPageBinance +
													rowsPerPageBinance
											)
											.map(n => {
												return (
													<TableRow
														hover
														role='checkbox'
														tabIndex={-1}
														onClick={() => {
															const link = `/Chart/${n.symbol.replace('/', '')}`
															history.push(link)
														}}
														key={n.symbol}>
														<TableCell padding='checkbox'>
															<Checkbox
																onClick={event => {
																	// prevent event bubbling in nested component
																	event.stopPropagation()
																	this.handleClick(event, n)
																}}
																checked={n.favorite}
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
														<TableCell align='right'>{n.name}</TableCell>
														<TableCell align='right'>
															{n.close.toFixed(8)}
														</TableCell>
														<TableCell align='right'>
															{n.percentChange.toFixed(2) + '%'}
														</TableCell>
														<TableCell align='right'>
															{n.high.toFixed(8)}
														</TableCell>
														<TableCell align='right'>
															{n.low.toFixed(8)}
														</TableCell>
														<TableCell align='right'>
															{n.quoteVolume.toFixed(8)}
														</TableCell>
													</TableRow>
												)
											})}
									</TableBody>
								</Table>
							</div>
							<TablePagination
								rowsPerPageOptions={[5, 10, 25, 50, 100, 'Max']}
								component='div'
								count={list.length}
								rowsPerPage={rowsPerPageBinance}
								page={pageBinance[markets]}
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
