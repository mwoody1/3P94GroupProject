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
import { VideoFileMeta, useProjects } from '../common/Context';
import { fileCallbackToPromise, humanFileSize } from '../common';
import Button from '@material-ui/core/Button';
import { useSnackbar } from 'notistack';
import Tooltip from '@material-ui/core/Tooltip';
import BackdropComponent from '../common/Backdrop';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(1),
      maxHeight: 170,
      transition: '0.5s',
      '&:hover' : {
        maxHeight: 500,
        transitionDelay: '0.3s'
      }
    },
    actionColumn: {
      [theme.breakpoints.up('lg')]: {
        width: 185,
      },
      textAlign: 'center',
      borderRight: '2px dotted grey'
    },
    button: {
      // marginLeft: theme.spacing(1)
      margin: theme.spacing(1)
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
  const { currentProject, setCurrentProject } = useProjects();
  const { selectedImage, selectedVideo, videoFiles } = currentProject;
  const [isLoading, setIsLoading] = React.useState(false);

  const handleRemove = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number) => {
    event.stopPropagation();
    if (selectedVideo) {
      let selectedVideoIndex = videoFiles.findIndex(file => file.name === selectedVideo.name);
      if (index === selectedVideoIndex) {
        setCurrentProject({ ...currentProject, videoFiles: videoFiles.filter((_, i) => i !== index), selectedVideo: undefined });
      } else {
        setCurrentProject({ ...currentProject, videoFiles: videoFiles.filter((_, i) => i !== index) });
      }
    } else {
      setCurrentProject({ ...currentProject, videoFiles: videoFiles.filter((_, i) => i !== index) });
    }
    enqueueSnackbar(`${videoFiles[index].name} removed.`, { variant: 'info' });
  }

  const handleSelect = (file: VideoFileMeta) => {
    if (selectedImage) {
      setCurrentProject({ ...currentProject, selectedImage: undefined, selectedVideo: file });
    } else {
      setCurrentProject({ ...currentProject, selectedVideo: file });
    }
  }

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    let files = event.target.files;

    if (!files) return;
    
    setIsLoading(true);

    try {
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
      setCurrentProject({ ...currentProject, videoFiles: videoFiles.concat(newVideoFiles) });
    } catch (err) {
      console.warn(err);
      enqueueSnackbar('There was a problem loading the files.', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
    
  };

  const importPublicVideos = async () => {
    setIsLoading(true);

    const fileNames = [ 
      'Dogs.mp4',
      'NiagaraFalls.mp4'
    ];

    try {
      let files = await Promise.all(fileNames.map(async file => (await fetch(`./videos/${file}`)).blob()));

      if (!files) return;
  
      let newVideoFiles = await Promise.all(Array.from(files).map(async (file, index) => {
        let src = URL.createObjectURL(file);
        let fileMeta: VideoFileMeta;
        let video = document.createElement('video');
        
        video.src = src;
        await fileCallbackToPromise(video);
        fileMeta = { name: fileNames[index], size: file.size, type: file.type, src, width: video.videoWidth, height: video.videoHeight, length: video.duration.toString()};
        
        return fileMeta;
      }));
  
      
      enqueueSnackbar(`${newVideoFiles.length} video file(s) added.`);
      setCurrentProject({ ...currentProject, videoFiles: videoFiles.concat(newVideoFiles) });
    } catch (err) {
      console.warn(err);
      enqueueSnackbar('There was a problem loading the files.', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
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
      {videoFiles.length === 0 &&
        <>
          <label htmlFor="video-import">
            <Button
              variant="outlined"
              className={classes.button}
              component="span"
              startIcon={<VideoLibraryIcon />}>
              Add Videos
            </Button>
          </label>
          OR
          <Button
            variant="outlined"
            onClick={importPublicVideos}
            className={classes.button}
            component="span"
          >
            Load Test Videos (20 MB)
          </Button>
        </>
      }
      {videoFiles.length > 0 && 
      <TableContainer className={classes.root} component={Paper} elevation={24}>
        <Table stickyHeader size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell className={classes.actionColumn}>
                <label htmlFor="video-import">
                  <Button
                    variant="outlined"
                    fullWidth
                    component="span"
                    startIcon={<VideoLibraryIcon />}>
                    Add Videos
                  </Button>
                </label>
              </TableCell>
              <TableCell>Video Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right">Length</TableCell>
              <TableCell align="right">Dimensions</TableCell>
              <TableCell align="right">Size</TableCell>
              <TableCell>Preview</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {videoFiles.map((file, index) => (
              <TableRow key={index} hover className={classes.clickable} onClick={() => handleSelect(file)}>
                <TableCell component="th" scope="row" className={classes.actionColumn}>
                  <Tooltip title={`Delete ${file.name}`} arrow>
                    <IconButton onClick={(e) => handleRemove(e, index)}>
                      <DeleteForeverIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell>{file.name.replace(/\.[^/.]+$/, "")}</TableCell>
                <TableCell>{file.name.split('.').pop()}</TableCell>
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
      <BackdropComponent open={isLoading} />
    </>
  );
}

export default VideoFilesTable;