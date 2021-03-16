import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { useFiles } from '../common/Context';
import { humanFileSize } from '../common';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(1),
      maxHeight: 160
    },
    table: {
      // minWidth: 650,
    },
  })
);

const AudioFilesTable = () => {
  const classes = useStyles();
  const { audioFiles, setAudioFiles } = useFiles();

  const handleRemove = (index: number) => {
    setAudioFiles(audioFiles => audioFiles.filter((_, i) => i !== index))
  }

  if (audioFiles.length === 0) return (<div>No Audio</div>);

  return (
    <TableContainer className={classes.root} component={Paper}>
      <Table stickyHeader className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Audio Name</TableCell>
            <TableCell align="right">Length</TableCell>
            <TableCell align="right">Size</TableCell>
            <TableCell>Preview</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {audioFiles.map((file, index) => (
            <TableRow hover key={index}>
              <TableCell component="th" scope="row">
                <IconButton onClick={() => handleRemove(index)}>
                  <DeleteForeverIcon />
                </IconButton>
                {file.name}
              </TableCell>
              <TableCell align="right">{file.length}</TableCell>
              <TableCell align="right">{humanFileSize(file.size)}</TableCell>
              <TableCell>
                <audio src={file.src} controls></audio>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default AudioFilesTable;