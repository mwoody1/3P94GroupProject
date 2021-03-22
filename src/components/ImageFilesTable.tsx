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
import ImageIcon from '@material-ui/icons/Image';
import { ImageFileMeta, useProjects } from '../common/Context';
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

const ImageFilesTable = () => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { currentProject, setCurrentProject } = useProjects();
  const { selectedImage, selectedVideo, imageFiles } = currentProject;
  const [isLoading, setIsLoading] = React.useState(false);

  const handleRemove = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number) => {
    event.stopPropagation();
    if (selectedImage) {
      let selectedImageIndex = imageFiles.findIndex(file => file.name === selectedImage.name);
      if (index === selectedImageIndex) {
        setCurrentProject({ ...currentProject, imageFiles: imageFiles.filter((_, i) => i !== index), selectedImage: undefined });
      } else {
        setCurrentProject({ ...currentProject, imageFiles: imageFiles.filter((_, i) => i !== index) });
      }
    } else {
      setCurrentProject({ ...currentProject, imageFiles: imageFiles.filter((_, i) => i !== index) });
    }
    enqueueSnackbar(`${imageFiles[index].name} removed.`, { variant: 'info' });
  }
  
  const handleSelect = (file: ImageFileMeta) => {
    if (selectedVideo) {
      setCurrentProject({ ...currentProject, selectedVideo: undefined, selectedImage: file });
    } else {
      setCurrentProject({ ...currentProject, selectedImage: file });
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    let files = event.target.files;
  
    if (!files) return;
    
    setIsLoading(true);

    try {
      let newImageFiles = await Promise.all(Array.from(files).map(async file => {
        let src = URL.createObjectURL(file);
        let fileMeta: ImageFileMeta;
        let image = document.createElement('img');
    
        image.src = src;
        await fileCallbackToPromise(image);
           
        fileMeta = { name: file.name, size: file.size, type: file.type, src, width: image.naturalWidth, height: image.naturalHeight};
    
        return fileMeta;
      }));
    
      event.target.value = ''; // allows the same file(s) to be submitted back to back, otherwise no "change" occurs
  
      enqueueSnackbar(`${newImageFiles.length} image file(s) added.`);
      setCurrentProject({ ...currentProject, imageFiles: imageFiles.concat(newImageFiles) });
    } catch (err) {
      console.warn(err);
      enqueueSnackbar('There was a problem loading the files.', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
   
  };
  
  const importPublicImages = async () => {
    setIsLoading(true);

    const fileNames = [ 
      '20180915_071710.jpg',
      '20180915_072221.jpg',
      '20180915_103601.jpg',
      '20180915_103613.jpg',
      '20180916_110818.jpg',
      '20180916_110820.jpg',
    ];

    try {
      let files = await Promise.all(fileNames.map(async file => (await fetch(`./images/${file}`)).blob()));

      if (!files) return;
  
      let newImageFiles = await Promise.all(Array.from(files).map(async (file, index) => {
        let src = URL.createObjectURL(file);
        let fileMeta: ImageFileMeta;
        let image = document.createElement('img');
    
        image.src = src;
        await fileCallbackToPromise(image);
           
        fileMeta = { name: fileNames[index], size: file.size, type: file.type, src, width: image.naturalWidth, height: image.naturalHeight};
    
        return fileMeta;
      }));
  
      enqueueSnackbar(`${newImageFiles.length} image file(s) added.`);
      setCurrentProject({ ...currentProject, imageFiles: imageFiles.concat(newImageFiles) });
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
        accept="image/*"
        className={classes.input}
        id="image-import"
        multiple
        type="file"
        onChange={(e) => handleImageUpload(e)}
      />
      {imageFiles.length === 0 &&
        <>
          <label htmlFor="image-import">
            <Button
              variant="outlined"
              className={classes.button}
              component="span"
              startIcon={<ImageIcon />}>
              Add Images
            </Button>
          </label>
          OR
          <Button
            variant="outlined"
            onClick={importPublicImages}
            className={classes.button}
            component="span"
          >
            Use Preloaded Images
          </Button>
        </>
      }
      {imageFiles.length > 0 &&
        <TableContainer className={classes.root} component={Paper} elevation={24}>
          <Table stickyHeader size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell className={classes.actionColumn}>
                  <label htmlFor="image-import">
                    <Button
                      variant="outlined"
                      fullWidth
                      component="span"
                      startIcon={<ImageIcon />}>
                      Add Images
                    </Button>
                  </label>
                </TableCell>
                <TableCell>Image Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell align="right">Dimensions</TableCell>
                <TableCell align="right">Size</TableCell>
                <TableCell>Preview</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {imageFiles.map((file, index) => (
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
                  <TableCell align="right">{`${file.width}x${file.height}`}</TableCell>
                  <TableCell align="right">{humanFileSize(file.size)}</TableCell>
                  <TableCell>
                    <img src={file.src} width={100} height={100} alt={file.name}></img>
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

export default ImageFilesTable;