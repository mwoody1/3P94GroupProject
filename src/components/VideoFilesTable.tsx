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
    clickable: {
      cursor: 'pointer'
    }
  })
);

const VideoFilesTable = () => {
  const classes = useStyles();
  const { videoFiles, setVideoFiles, selectedVideo, setSelectedVideo } = useFiles();

  const handleRemove = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number) => {
    event.stopPropagation();
    if (selectedVideo) {
      let selectedVideoIndex = videoFiles.findIndex(file => file.name === selectedVideo.name);
      if (index === selectedVideoIndex) {
        setSelectedVideo(undefined);
      }
    }
    
    setVideoFiles(videoFiles => videoFiles.filter((_, i) => i !== index));
  }

  if (videoFiles.length === 0) return (<div>No Videos</div>);

  return (
    <TableContainer className={classes.root} component={Paper}>
      <Table stickyHeader className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Video Name</TableCell>
            <TableCell align="right">Length</TableCell>
            <TableCell align="right">Dimensions</TableCell>
            <TableCell align="right">Size</TableCell>
            <TableCell>Preview</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {videoFiles.map((file, index) => (
            <TableRow key={index} hover className={classes.clickable} onClick={() => setSelectedVideo(file)}>
              <TableCell component="th" scope="row">
                <IconButton onClick={(e) => handleRemove(e, index)}>
                  <DeleteForeverIcon />
                </IconButton>
                {file.name}
              </TableCell>
              <TableCell align="right">{file.length}</TableCell>
              <TableCell align="right">{`${file.width}x${file.height}`}</TableCell>
              <TableCell align="right">{humanFileSize(file.size)}</TableCell>
              <TableCell>
                <video src={file.src} width={100} height={100}></video>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default VideoFilesTable;