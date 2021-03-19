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
import { AudioFileMeta, useProjects } from '../common/Context';
import { fileCallbackToPromise, humanFileSize } from '../common';
import Button from '@material-ui/core/Button';
import { useSnackbar } from 'notistack';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(1),
      maxHeight: 125,
      transition: '0.5s',
      '&:hover' : {
        maxHeight: 500,
        transitionDelay: '0.3s'
      }
    },
    actionColumn: {
      width: 175,
      textAlign: 'center',
      borderRight: '2px dotted grey'
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
  const { currentProject, setCurrentProject } = useProjects();
  const { audioFiles } = currentProject;

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
    setCurrentProject({ ...currentProject, audioFiles: audioFiles.concat(newAudioFiles) });
  };
  
  const handleRemove = (index: number) => {
    enqueueSnackbar(`${audioFiles[index].name} removed.`, { variant: 'info' });
    setCurrentProject({ ...currentProject, audioFiles: audioFiles.filter((_, i) => i !== index) });
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
      {audioFiles.length === 0 && 
        <label htmlFor="audio-import">
          <Button
            className={classes.button}
            component="span"
            startIcon={<LibraryMusicIcon />}>
            Add Audio
          </Button>
        </label>
      }
      {audioFiles.length > 0 &&
      <TableContainer className={classes.root} component={Paper}>
        <Table stickyHeader size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>
                <label htmlFor="audio-import">
                  <Button
                    component="span"
                    fullWidth
                    startIcon={<LibraryMusicIcon />}>
                    Add Audio
                  </Button>
                </label>
              </TableCell>
              <TableCell>Audio Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right">Length</TableCell>
              <TableCell align="right">Size</TableCell>
              <TableCell>Preview</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {audioFiles.map((file, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row" className={classes.actionColumn}>
                  <Tooltip title={`Delete ${file.name}`} arrow>
                    <IconButton onClick={() => handleRemove(index)}>
                      <DeleteForeverIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell>{file.name.replace(/\.[^/.]+$/, "")}</TableCell>
                <TableCell>{file.name.split('.').pop()}</TableCell>
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