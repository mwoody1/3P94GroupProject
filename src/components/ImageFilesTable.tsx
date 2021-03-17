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
import { ImageFileMeta, useFiles } from '../common/Context';
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

const ImageFilesTable = () => {
  const classes = useStyles();
  const { imageFiles, setImageFiles, selectedImage, setSelectedImage, selectedVideo, setSelectedVideo } = useFiles();

  const handleRemove = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number) => {
    event.stopPropagation();
    if (selectedImage) {
      let selectedImageIndex = imageFiles.findIndex(file => file.name === selectedImage.name);
      if (index === selectedImageIndex) {
        setSelectedImage(undefined);
      }
    }
    setImageFiles(imageFiles => imageFiles.filter((_, i) => i !== index))
  }
  
  const handleSelect = (file: ImageFileMeta) => {
    if (selectedVideo) {
      setSelectedVideo(undefined);
    }
    setSelectedImage(file);
  }

  if (imageFiles.length === 0) return (<div>No Images</div>);

  return (
    <TableContainer className={classes.root} component={Paper}>
      <Table stickyHeader className={classes.table} size="small" aria-label="a dense table">
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
  );
}

export default ImageFilesTable;