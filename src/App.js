import React from 'react';
// import ReactDOM from 'react-dom';
import './App.css';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import 'date-fns';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';

let state = {
  firstName: '',
  lastName: '',
  annualSalary: 0,
  superRate: 0,
  paymentStartDate: new Date(),
  displayErrors: false
};
let data = [];

const StyledCard = makeStyles({
  root: {
    background: 'rgb(162, 162, 235)',
    width: 900,
    marginLeft: '20%'
  }
});

const StyleTextField = makeStyles({
  root: {
    width: '100%',
    padding: '12px 20px',
    margin: '8px 0',
    boxSizing: ' border-box',
    border: 'none',
    borderRadius: '15px',
    backgroundColor: 'rgb(255, 249, 249)',
    color: 'rgb(10, 10, 10)',
    fontFamily: 'Arial, Helvetica, sans-serif'
  }
})

const formChangeHandler = (event) => {
  let nam = event.target.id;
  let val = event.target.value;
  state[nam] = val;
  // this.setState({ [nam]: val });
}

export function Userform() {
  const cardClass = StyledCard();
  const textClass = StyleTextField();
  return (
    <div>
    <h1>User Information</h1>
    <Card className={cardClass.root}>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <TextField className={textClass.root} id="firstName" onChange={formChangeHandler} label="First Name" variant="filled" required />
          </Grid>
          <Grid item xs={4}>
            <TextField className={textClass.root} id="lastName" onChange={formChangeHandler} label="Last Name" variant="filled" required />
          </Grid>
          <Grid item xs={4}>
            <TextField className={textClass.root} id="annualSalary"
              type="number"
              onChange={formChangeHandler}
              label="Anual Salary"
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                inputProps: { min: 0 }
              }}
              helperText="Must be positive"
              variant="filled" required />
          </Grid>
          <Grid item xs={6}>
            <TextField className={textClass.root} id="superRate" label="Super Rate"
              type="number"
              onChange={formChangeHandler}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                inputProps: { min: 0, max: 12 }
              }}
              helperText="0-12"
              variant="filled" required />
          </Grid>
          <Grid item xs={6}>
            <TextField
              className={textClass.root}
              margin="normal"
              id="paymentStartDate"
              type="date"
              variant="filled"
              onChange={formChangeHandler}
              label="Payment Start Date"
              required
            />
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <Button variant="contained" type="submit" color="primary">Submit</Button>
      </CardActions>
    </Card>
    </div>
  )
}

export default class TaxForm extends React.Component {

  constructor() {
    super();
    this.state = {
      data: {}
    }
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit = (event) => {
    event.preventDefault();
    if (!event.target.checkValidity()) {
      alert('Please fill all the required fields correctly');
      state['displayErrors'] = true;
      return;
    }
    state['displayErrors'] = false;
    fetch('http://localhost:3100/incometax', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state),
    }).then(response => response.json()).then(responseData => {
      data.push(responseData);
      this.setState({ data: responseData });
    }).catch(error => alert('Api Crashed', error));
  }



  render() {
    const displayErrors = state.displayErrors;
    if (!data.length)
      return (
        <div className={'container'}>
          <form noValidate onSubmit={this.handleSubmit} className={displayErrors ? 'displayErrors' : ''} autoComplete="off">
            <Userform />
          </form>
        </div>
      );
    else
      return (
        <div className={'container'}>
          <form noValidate onSubmit={this.handleSubmit} className={displayErrors ? 'displayErrors' : ''} autoComplete="off">
            <Userform />
          </form>
          <hr />
          <div className={'table-container'}>
            <CustomizedTables />
          </div>
        </div>
      )
  }
}

const StyleTable = makeStyles({
  table: {
    minWidth: 700,
    overflow: 'auto'
  },
});

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};


export function CustomizedTables() {
  const classes = StyleTable();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell align="right">Pay-Period</StyledTableCell>
            <StyledTableCell align="right">Gross Income</StyledTableCell>
            <StyledTableCell align="right">Income Tax</StyledTableCell>
            <StyledTableCell align="right">Net Income</StyledTableCell>
            <StyledTableCell align="right">Super Amount</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : data
          ).map((row,index) => (
            <StyledTableRow key={index}>
              <StyledTableCell component="th" scope="row">
                {row.name}
              </StyledTableCell>
              <StyledTableCell align="right">{row.payPeriod}</StyledTableCell>
              <StyledTableCell align="right">{row.grossIncome}</StyledTableCell>
              <StyledTableCell align="right">{row.incomeTax}</StyledTableCell>
              <StyledTableCell align="right">{row.netIncome}</StyledTableCell>
              <StyledTableCell align="right">{row.superAmount}</StyledTableCell>
            </StyledTableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={3}
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: { 'aria-label': 'rows per page' },
                native: true,
              }}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}