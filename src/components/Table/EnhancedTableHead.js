import React from 'react'
import PropTypes from 'prop-types'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Tooltip from '@material-ui/core/Tooltip'

const rows = [
	{ id: 'symbol', numeric: false, disablePadding: true, label: 'Pair' },
	{ id: 'name', numeric: true, disablePadding: false, label: 'Name' },
	{
		id: 'close',
		numeric: true,
		disablePadding: false,
		label: 'Last Price',
	},
	{
		id: 'percentChange',
		numeric: true,
		disablePadding: false,
		label: '24h Change',
	},
	{ id: 'high', numeric: true, disablePadding: false, label: '24h High' },
	{ id: 'low', numeric: true, disablePadding: false, label: '24h Low' },
	{ id: 'quoteVolume', numeric: true, disablePadding: false, label: 'Volume' },
]

class EnhancedTableHead extends React.Component {
	createSortHandler = property => event => {
		this.props.onRequestSort(event, property)
	}

	render() {
		const { order, orderBy } = this.props

		return (
			<TableHead>
				<TableRow>
					<TableCell padding='checkbox' />
					{rows.map(
						row => (
							<TableCell
								key={row.id}
								align={row.numeric ? 'right' : 'left'}
								padding={row.disablePadding ? 'none' : 'default'}
								sortDirection={orderBy === row.id ? order : false}>
								<Tooltip
									title='Sort'
									placement={row.numeric ? 'bottom-end' : 'bottom-start'}
									enterDelay={300}>
									<TableSortLabel
										active={orderBy === row.id}
										direction={order}
										onClick={this.createSortHandler(row.id)}>
										{row.label}
									</TableSortLabel>
								</Tooltip>
							</TableCell>
						),
						this
					)}
				</TableRow>
			</TableHead>
		)
	}
}

EnhancedTableHead.propTypes = {
	onRequestSort: PropTypes.func.isRequired,
	order: PropTypes.string.isRequired,
	orderBy: PropTypes.string.isRequired,
}

export default EnhancedTableHead
