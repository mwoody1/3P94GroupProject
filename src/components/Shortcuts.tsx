import React from 'react';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { getApplicationKeyMap } from 'react-hotkeys';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(1),
      maxWidth: 400
    }
  })
);

const Shortcuts = () => {
  const classes = useStyles();
  const keyMaps = getApplicationKeyMap();

  return (
    <>
      <Typography variant="h3" gutterBottom>
          Hotkeys
      </Typography>
      <Typography variant="body1" gutterBottom>
          All the hotkeys associated with the current project screen will require a second press if initiated from a different screen (the first press will navigate to the home page and the second will excecute the shortcut).
      </Typography>
      <TableContainer className={classes.root} component={Paper}>
        <Table id="hotkeys-table" stickyHeader size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell><strong>Action</strong></TableCell>
              <TableCell><strong>Shortcut</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(keyMaps).map((keyMap, index) => {
              const { name, sequences } = keyMaps[keyMap];

              return (<TableRow key={index}>
                <TableCell component="th" scope="row">
                  {name}
                </TableCell>
                <TableCell>{sequences.map(({ sequence }, i) => <span key={i}>{sequence}</span>)}</TableCell>
              </TableRow>);
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default Shortcuts;