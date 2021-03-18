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
import LibraryMusicIcon from '@material-ui/icons/LibraryMusic';
import { AudioFileMeta, useProject } from '../common/Context';
import { fileCallbackToPromise, humanFileSize } from '../common';
import Button from '@material-ui/core/Button';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(1),
      maxHeight: 160
    },
    button: {
      marginLeft: theme.spacing(1)
    },
    input: {
      display: 'none'
    }
  })
);

const AudioFilesTable = () => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { audioFiles, setAudioFiles } = useProject();

  const handleAudioUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    let files = event.target.files;

    if (!files) return;
    
    let newAudioFiles = await Promise.all(Array.from(files).map(async file => {
      let src = URL.createObjectURL(file);
      let fileMeta: AudioFileMeta;
      let audio = document.createElement('audio');

      audio.src = src;
      await fileCallbackToPromise(audio);
     
      fileMeta = { name: file.name, size: file.size, type: file.type, src, length: audio.duration.toString()};
      
      return fileMeta;
    }));

    event.target.value = ''; // allows the same file(s) to be submitted back to back, otherwise no "change" occurs
    enqueueSnackbar(`${newAudioFiles.length} audio file(s) added.`);
    setAudioFiles(audioFiles => audioFiles.concat(newAudioFiles));
  };
  
  const handleRemove = (index: number) => {
    enqueueSnackbar(`${audioFiles[index].name} removed.`, { variant: 'info' });
    setAudioFiles(audioFiles => audioFiles.filter((_, i) => i !== index))
  }

  return (
    <>
      <input
        accept="audio/*"
        className={classes.input}
        id="audio-import"
        multiple
        type="file"
        onChange={(e) => handleAudioUpload(e)}
      />
      <label htmlFor="audio-import">
        <Button
          className={classes.button}
          component="span"
          fullWidth
          startIcon={<LibraryMusicIcon />}>
          Add Audio
        </Button>
      </label>
      {audioFiles.length > 0 &&
      <TableContainer className={classes.root} component={Paper}>
        <Table stickyHeader size="small" aria-label="a dense table">
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
              <TableRow key={index}>
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
      }
    </>
  );
}

export default AudioFilesTable;