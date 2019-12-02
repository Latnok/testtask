import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Fab from '@material-ui/core/Fab';
import LinearProgress from '@material-ui/core/LinearProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';

import Cart from './Cart';

import Axios from 'axios';

const useStyles = makeStyles(theme => ({
  appBar: {
    position: 'relative',
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '100%'
  },
  formControl: {
    marginLeft: theme.spacing(1),
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

function App() {
  const classes = useStyles();

  const [items, setItems] = useState([]);
  const [totals, setTotals] = useState();

  const handleCalc = async () => {
    await Axios.post('http://localhost:8080/api/calc', items
    ).then((response) => {
      setTotals(response.data);
    }).catch((error) => {
      console.log(error);
    })
  };

  const handleAdd = (values) => {
    items.push(values)
    setItems(items);
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      quantity: 1,
      currency: '',
      price:1
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(1, 'Must be 1 character or more')
        .required('Required'),
      quantity: Yup.number()
        .positive('Only positive')
        .integer('Only integer')
        .required('Required'),
      price: Yup.number()
        .positive('Only positive')
        .required('Required'),
      currency: Yup.mixed()
        .oneOf(['RUB', 'USD', 'EUR'])
        .required('Required'),
    }),
    onSubmit: (values, { setSubmitting, resetForm }) => {
      handleAdd(values);
      setSubmitting(false);
      resetForm();
    },
  });

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="absolute" color="default" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
          </Typography>
        </Toolbar>
      </AppBar>
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4" align="center">
            Product
          </Typography>
          <form onSubmit={formik.handleSubmit} className={classes.container}>
            <List>
              <ListItem>
                <TextField
                  label="Name"
                  id="name"
                  name="name"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                  disabled={formik.isSubmitting}
                  className={classes.textField}
                  helperText={formik.touched.name ? formik.errors.name : ""}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                />
              </ListItem>
              <ListItem>
                <TextField
                  label="Quantity"
                  id="quantity"
                  name="quantity"
                  type="number"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.quantity}
                  disabled={formik.isSubmitting}
                  className={classes.textField}
                  helperText={formik.touched.quantity ? formik.errors.quantity : ""}
                  error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                />
              </ListItem>
              <ListItem>
                <TextField
                  label="Price"
                  id="price"
                  name="price"
                  type="number"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.price}
                  disabled={formik.isSubmitting}
                  className={classes.textField}
                  helperText={formik.touched.price ? formik.errors.price : ""}
                  error={formik.touched.price && Boolean(formik.errors.price)}
                />
              </ListItem>
              <ListItem>
                <FormControl
                  component="fieldset"
                  className={classes.formControl}
                  onChange={formik.handleChange}
                  error={formik.touched.currency && Boolean(formik.errors.currency)}
                >
                  <FormLabel component="legend">Currency</FormLabel>
                  <RadioGroup
                    name="currency"
                    row
                  >
                    <FormControlLabel
                      control={<Radio />}
                      label="RUB"
                      value="RUB"
                      disabled={formik.isSubmitting}
                    />
                    <FormControlLabel
                      control={<Radio />}
                      label="USD"
                      value="USD"
                      disabled={formik.isSubmitting}
                    />
                    <FormControlLabel
                      control={<Radio />}
                      label="EUR"
                      value="EUR"
                      disabled={formik.isSubmitting}
                    />
                  </RadioGroup>
                  <FormHelperText>{formik.touched.currency ? formik.errors.currency : ""}</FormHelperText>
                </FormControl>
              </ListItem>

              <ListItem>
                <br />
                {formik.isSubmitting && <LinearProgress />}
                <br />
                <Fab color="primary" onClick={formik.submitForm}>
                  <AddIcon />
                </Fab>
              </ListItem>
            </List>
          </form>
        </Paper>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4" align="center">
            List
          </Typography>
          <Cart
            products={items}
            totals={totals}
          />
          <br />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCalc}
            className={classes.button}
          >
            calc
          </Button>
        </Paper>
      </main>
    </React.Fragment>
  );
}

export default App;
