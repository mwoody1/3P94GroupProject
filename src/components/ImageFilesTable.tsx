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
import { ImageFileMeta, useProject } from '../common/Context';
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

const ImageFilesTable = () => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { imageFiles, setImageFiles, selectedImage, setSelectedImage, selectedVideo, setSelectedVideo } = useProject();

  const handleRemove = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number) => {
    event.stopPropagation();
    if (selectedImage) {
      let selectedImageIndex = imageFiles.findIndex(file => file.name === selectedImage.name);
      if (index === selectedImageIndex) {
        setSelectedImage(undefined);
      }
    }
    enqueueSnackbar(`${imageFiles[index].name} removed.`, { variant: 'info' });
    setImageFiles(imageFiles => imageFiles.filter((_, i) => i !== index))
  }
  
  const handleSelect = (file: ImageFileMeta) => {
    if (selectedVideo) {
      setSelectedVideo(undefined);
    }
    setSelectedImage(file);
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    let files = event.target.files;
  
    if (!files) return;
    
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
    setImageFiles(imageFiles => imageFiles.concat(newImageFiles));
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
      <label htmlFor="image-import">
        <Button
          className={classes.button}
          component="span"
          fullWidth
          startIcon={<ImageIcon />}>
          Add Images
        </Button>
      </label>
      {imageFiles.length > 0 &&
        <TableContainer className={classes.root} component={Paper}>
          <Table stickyHeader size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Image Name</TableCell>
                <TableCell align="right">Dimensions</TableCell>
                <TableCell align="right">Size</TableCell>
                <TableCell>Preview</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {imageFiles.map((file, index) => (
                <TableRow key={index} hover className={classes.clickable} onClick={() => handleSelect(file)}>
                  <TableCell component="th" scope="row">
                    <IconButton onClick={(e) => handleRemove(e, index)}>
                      <DeleteForeverIcon />
                    </IconButton>
                    {file.name}
                  </TableCell>
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
    </>
  );
}

export default ImageFilesTable;