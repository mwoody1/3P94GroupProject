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
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import { VideoFileMeta, useProject } from '../common/Context';
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
    },
    clickable: {
      cursor: 'pointer'
    }
  })
);

const VideoFilesTable = () => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { videoFiles, setVideoFiles, selectedVideo, setSelectedVideo, selectedImage, setSelectedImage } = useProject();

  const handleRemove = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number) => {
    event.stopPropagation();
    if (selectedVideo) {
      let selectedVideoIndex = videoFiles.findIndex(file => file.name === selectedVideo.name);
      if (index === selectedVideoIndex) {
        setSelectedVideo(undefined);
      }
    }
    enqueueSnackbar(`${videoFiles[index].name} removed.`, { variant: 'info' });
    setVideoFiles(videoFiles => videoFiles.filter((_, i) => i !== index));
  }

  const handleSelect = (file: VideoFileMeta) => {
    if (selectedImage) {
      setSelectedImage(undefined);
    }
    setSelectedVideo(file);
  }

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    let files = event.target.files;

    if (!files) return;
    
    let newVideoFiles = await Promise.all(Array.from(files).map(async file => {
      let src = URL.createObjectURL(file);
      let fileMeta: VideoFileMeta;
      let video = document.createElement('video');
      
      video.src = src;
      await fileCallbackToPromise(video);
      fileMeta = { name: file.name, size: file.size, type: file.type, src, width: video.videoWidth, height: video.videoHeight, length: video.duration.toString()};
      
      return fileMeta;
    }));

    event.target.value = ''; // allows the same file(s) to be submitted back to back, otherwise no "change" occurs
    enqueueSnackbar(`${newVideoFiles.length} video file(s) added.`);
    setVideoFiles(videoFiles => videoFiles.concat(newVideoFiles));
  };

  return (
    <>
      <input
        accept="video/*"
        className={classes.input}
        id="video-import"
        multiple
        type="file"
        onChange={(e) => handleVideoUpload(e)}
      />
      <label htmlFor="video-import">
        <Button
          className={classes.button}
          component="span"
          fullWidth
          startIcon={<VideoLibraryIcon />}>
          Add Videos
        </Button>
      </label>
      {videoFiles.length > 0 && 
      <TableContainer className={classes.root} component={Paper}>
        <Table stickyHeader size="small" aria-label="a dense table">
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
              <TableRow key={index} hover className={classes.clickable} onClick={() => handleSelect(file)}>
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
      }
    </>
  );
}

export default VideoFilesTable;