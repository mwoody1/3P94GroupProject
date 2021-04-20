import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import LibraryMusicIcon from '@material-ui/icons/LibraryMusic';
import { useProjects, AudioFileMeta } from '../common/Context';
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
    },
    clickable: {
      cursor: 'pointer'
    }
  })
);

const AudioFilesTable = () => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { currentProject, setCurrentProject } = useProjects();
  const { audioFiles } = currentProject;
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
            <td key="audio-import" className={classes.actionColumn}>
              <label htmlFor="audio-import">
                <Button
                  color="secondary"
                  variant="outlined"
                  className={classes.button}
                  component="span"
                  startIcon={<LibraryMusicIcon />}>
                  Add Audio
                </Button>
              </label>
            </td>
          )
        },
        customBodyRenderLite: (dataIndex, rowIndex) => {
          return (
            <Tooltip title={`Delete ${audioFiles[rowIndex].name}`} arrow>
              <IconButton onClick={() => handleRemove(rowIndex)}>
                <DeleteForeverIcon />
              </IconButton>
            </Tooltip>
          )
        }
      }
    },
    {
     name: "name",
     label: "Audio Name",
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
      name: "size",
      label: "Size",
      options: {
       sort: true,
       sortThirdClickReset: true,
       customBodyRenderLite: (dataIndex) => {
        return humanFileSize(audioFiles[dataIndex].size);
       }
      }
     },
     {
      name: "preview",
      label: "Preview",
      options: {
       sort: false,
      }
     },
  ];

  const data = audioFiles.map((audio, index) => {
    return {
      index,
      name: audio.name.replace(/\.[^/.]+$/, ""),
      type: audio.name.split('.').pop(),
      length: new Date(Number(audio.length) * 1000).toISOString().substr(11, 8),
      size: audio.size,
      preview: <audio src={audio.src} controls></audio>
    }
  });

  const handleAudioUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    let files = event.target.files;

    if (!files) return;
    
    setIsLoading(true);

    try {
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
    } catch (err) {
      console.warn(err);
      enqueueSnackbar('There was a problem loading the files.', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
    
  };
  
  const handleRemove = (index: number) => {
    enqueueSnackbar(`${audioFiles[index].name} removed.`, { variant: 'info' });
    setCurrentProject({ ...currentProject, audioFiles: audioFiles.filter((_, i) => i !== index) });
  }

  const importPublicAudio = async () => {
    setIsLoading(true);

    const fileNames = [ 
      'rabbit.wav',
      'thisisatest.wav'
    ];

    try {
      let files = await Promise.all(fileNames.map(async file => (await fetch(`./audio/${file}`)).blob()));

      if (!files) return;
  
      let newAudioFiles = await Promise.all(Array.from(files).map(async (file, index) => {
        let src = URL.createObjectURL(file);
        let fileMeta: AudioFileMeta;
        let audio = document.createElement('audio');
  
        audio.src = src;
        await fileCallbackToPromise(audio);
       
        fileMeta = { name: fileNames[index], size: file.size, type: file.type, src, length: audio.duration.toString()};
        
        return fileMeta;
      }));
  
      enqueueSnackbar(`${newAudioFiles.length} audio file(s) added.`);
      setCurrentProject({ ...currentProject, audioFiles: audioFiles.concat(newAudioFiles) });
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
        accept="audio/*"
        className={classes.input}
        id="audio-import"
        multiple
        type="file"
        onChange={(e) => handleAudioUpload(e)}
      />
      {audioFiles.length === 0 &&
        <>
          <label htmlFor="audio-import">
            <Button
              color="secondary"
              variant="outlined"
              className={classes.button}
              component="span"
              startIcon={<LibraryMusicIcon />}>
              Add Audio
            </Button>
          </label>
          OR
          <Button
            variant="outlined"
            onClick={importPublicAudio}
            className={classes.button}
            component="span"
          >
            Load Test Audio (200 KB)
          </Button>
        </>
      }
      {audioFiles.length > 0 && 
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

export default React.memo(AudioFilesTable);
