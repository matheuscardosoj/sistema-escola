/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TablePagination, Paper, TableSortLabel,
} from "@mui/material";

function CustomTable({ rows, columns, buttons }) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [data, setData] = useState(rows);
    const [orders, setOrder] = useState(columns.reduce((acc) => {
        acc.push(null);
        return acc;
    }, []));
    const [orderBys, setOrderBys] = useState(columns.reduce((acc) => {
        acc.push(null);
        return acc;

    }, []));

    useEffect(() => {
        setData(rows);
    }, [rows]);

    function handleChangePage(event, newPage) {
        setPage(newPage);
    }

    function handleChangeRowsPerPage(event) {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }

    function descendingComparator(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }

        if (b[orderBy] > a[orderBy]) {
            return 1;
        }

        return 0;
    }

    function getComparator(orderBys, orders) {
        return function (a, b) {
            for (let i = 0; i < orderBys.length; i++) {
                const orderBy = orderBys[i];
                const order = orders[i];

                const comparison = order === "desc"
                    ? descendingComparator(a, b, orderBy)
                    : -descendingComparator(a, b, orderBy);

                if (comparison !== 0) {
                    return comparison;
                }
            }

            return 0;
        };

    }

    function stableSort(array, comparator) {
        const stabilizedThis = array.map((el, index) => [el, index]);

        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);

            if (order !== 0) {
                return order;
            }

            return a[1] - b[1];
        });

        return stabilizedThis.map((el) => el[0]);
    }

    function handleRequestSort(columnId) {
        const columnIndex = columns.findIndex((column) => column.id === columnId);
        const currentOrder = orders[columnIndex];

        const newOrder = currentOrder === 'asc' ? 'desc' : currentOrder === 'desc' ? null : 'asc';

        const newOrders = [...orders];
        const newOrderBys = [...orderBys];

        if (newOrder) {
            const activeColumnsCount = newOrders.filter((order) => order !== null).length;

            if (activeColumnsCount >= 2 && !newOrders[columnIndex]) {
                return;
            }

            newOrders[columnIndex] = newOrder;
            newOrderBys[columnIndex] = columnId;

        } else {
            newOrders[columnIndex] = null;
            newOrderBys[columnIndex] = null;
        }

        const activeOrders = newOrders.filter((order) => order !== null);
        const activeOrderBys = newOrderBys.filter((orderBy) => orderBy !== null);

        setOrder(newOrders);
        setOrderBys(newOrderBys);

        const sortedData = activeOrderBys.length > 0
            ? stableSort(data, getComparator(activeOrderBys, activeOrders))
            : rows;

        setData(sortedData);
    }

    return (
        <Paper>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            {columns.map((column, index) => (
                                <TableCell key={column.id}>
                                    <TableSortLabel
                                        active={orderBys[index] === column.id}
                                        onClick={() => {
                                            handleRequestSort(column.id);
                                        }}
                                        direction={orderBys[index] === column.id ? orders[index] : "asc"}
                                    >
                                        {column.label}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                            {buttons && buttons.length > 0 && (
                                <TableCell>Ações</TableCell>
                            )}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {data.length > 0 ? (
                            data
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => (
                                    <TableRow key={row.id} >
                                        {columns.map((column) => (
                                            <TableCell key={column.id}>{row[column.id]}</TableCell>
                                        ))}
                                        <TableCell style={{ display: "flex", gap: "0 1rem", height: "fit-content" }}>
                                            {buttons.map((button, index) => {
                                                return (
                                                    <button className="button" key={index} onClick={() => button.onClick(row.id)}>
                                                        {button.label}
                                                    </button>
                                                );
                                            })}
                                        </TableCell>
                                    </TableRow>
                                ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length + 1} style={{ textAlign: 'center' }}>
                                    Sem dados
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Linhas por página"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
            />
        </Paper>
    );
}

export default CustomTable;
