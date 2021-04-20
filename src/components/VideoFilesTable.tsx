import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import { VideoFileMeta, useProjects } from '../common/Context';
import { fileCallbackToPromise, humanFileSize } from '../common';
import Button from '@material-ui/core/Button';
import { useSnackbar } from 'notistack';
import BackdropComponent from '../common/Backdrop';
import MUIDataTable, { MUIDataTableColumnDef, MUIDataTableOptions } from 'mui-datatables';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    actionColumn: {
      [theme.breakpoints.up('lg')]: {
        width: 175,
      },
      textAlign: 'center',
      borderBottom: '1px solid rgba(81, 81, 81, 1)',
      position: 'sticky',
      backgroundColor: theme.palette.background.paper,
      zIndex: 100,
      top: '0px'
    },
    button: {
      margin: theme.spacing(1)
    },
    input: {
      display: 'none'
    }
  })
);

const VideoFilesTable = () => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { currentProject, setCurrentProject } = useProjects();
  const { selectedImage, selectedVideo, videoFiles } = currentProject;
  const [isLoading, setIsLoading] = React.useState(false);

  const options: MUIDataTableOptions = {
    download: false,
    filter: false,
    pagination: false,
    print: false,
    search: false,
    viewColumns: false,
    selectableRows: 'none',
    fixedHeader: true,
    onRowClick: (_, { dataIndex }) => handleSelect(videoFiles[dataIndex]),
    tableBodyMaxHeight: '300px'
  };

  const columns: MUIDataTableColumnDef[] = [
    {
      name: "Delete",
      options: {
        filter: false,
        sort: false,
        empty: true,
        customHeadRender: () => {
          return (
            <td key="video-import" className={classes.actionColumn}>
              <label htmlFor="video-import">
                <Button
                  color="secondary"
                  variant="outlined"
                  className={classes.button}
                  component="span"
                  startIcon={<VideoLibraryIcon />}>
                  Add Videos
                </Button>
              </label>
            </td>
          )
        },
        customBodyRenderLite: (dataIndex, rowIndex) => {
          return (
            <Tooltip title={`Delete ${videoFiles[rowIndex].name}`} arrow>
              <IconButton onClick={(e) => handleRemove(e, rowIndex)}>
                <DeleteForeverIcon />
              </IconButton>
            </Tooltip>
          )
        }
      }
    },
    {
     name: "name",
     label: "Video Name",
     options: {
      sort: true,
      sortThirdClickReset: true,
     }
    },
    {
     name: "type",
     label: "Type",
     options: {
      sort: true,
      sortThirdClickReset: true,
     }
    },
    {
     name: "length",
     label: "Length",
     options: {
      sort: true,
      sortThirdClickReset: true,
     }
    },
    {
     name: "dimensions",
     label: "Dimensions",
     options: {
      sort: false,
     }
    },
    {
      name: "size",
      label: "Size",
      options: {
       sort: true,
       sortThirdClickReset: true,
       customBodyRenderLite: (dataIndex) => {
        return humanFileSize(videoFiles[dataIndex].size);
       }
      }
     },
     {
      name: "preview",
      label: "Preview",
      options: {
       sort: false,
      },
     },
  ];

  const data = videoFiles.map((video, index) => {
    return {
      index,
      name: video.name.replace(/\.[^/.]+$/, ""),
      type: video.name.split('.').pop(),
      length: new Date(Number(video.length) * 1000).toISOString().substr(11, 8),
      dimensions: `${video.width}x${video.height}`,
      size: video.size,
      preview: <video src={video.src} width={50} height={50}></video>
    }
  });

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
              color="secondary"
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
        <MUIDataTable
          title=''
          data={data}
          columns={columns}
          options={options}
        />
      }
      <BackdropComponent open={isLoading} />
    </>
  );
}

export default React.memo(VideoFilesTable);
