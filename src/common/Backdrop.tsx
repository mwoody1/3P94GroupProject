import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import { convertHexToRGBA } from '.';

type BackdropProps = {
  open: boolean
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: theme.palette.secondary.main,
      background: convertHexToRGBA(theme.palette.background.default, 0.5),
      // background: '#424242'
    }
  }),
);

const BackdropComponent = ({ open }: BackdropProps ) => {
  const classes = useStyles();

  return (
    <Backdrop className={classes.backdrop} open={open}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}

export default BackdropComponent;