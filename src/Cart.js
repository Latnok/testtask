import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({}));

function Cart({products, totals, handleDelete}) {
  const classes = useStyles();
  return (
    <List disablePadding>
      {products.map((product, key) => (
        <ListItem className={classes.listItem} key={'product' + product.name}>
          <ListItemText primary={product.name} secondary={' x ' + product.quantity} />
          <Typography variant="body2">{product.price} {product.currency}</Typography>
        </ListItem>
      ))}
      {totals ?
      <ListItem className={classes.listItem}>
        <ListItemText primary="Total" />
        <Typography variant="subtitle1" className={classes.total}>
        <div>{totals.USD.toFixed(2)} USD</div>
        <div>{totals.EUR.toFixed(2)} EUR</div>
        <div>{totals.RUB.toFixed(2)} RUB</div>
        </Typography>
      </ListItem>
      : ''}
    </List>
)}

export default Cart;
