import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useSnackbar } from 'notistack';
import BackdropComponent from '../common/Backdrop';
import { ImageFileMeta } from '../common/Context';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

type Props = {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  selectedImage: ImageFileMeta
}

const ImageExportDialog = ({ open, setOpen, selectedImage }: Props) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleExport = () => {
    setLoading(true);
    setOpen(false);
    // fake export
    setTimeout(() => {
      setLoading(false);
      enqueueSnackbar('Image exported.', { variant: 'success' });
    }, 500);
  }

  return (
    <>
      <Dialog open={open} onClose={handleClose} aria-labelledby="video-export-dialog">
        <DialogTitle id="video-export-dialog">Video Export Options</DialogTitle>
        <DialogContent>
          <DialogContentText>
            
          </DialogContentText>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={6}>
              <TextField
                autoFocus
                defaultValue={selectedImage.name.replace(/\.[^/.]+$/, "")}
                variant="filled"
                margin="dense"
                label="File Name"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl>
                <InputLabel id="file-type">File Type</InputLabel>
                <Select
                  defaultValue={7}
                  variant="filled"
                  margin="dense"
                  id="file-type"
                  label="File Type"
                >
                  <MenuItem value={0}>avif</MenuItem>
                  <MenuItem value={1}>bmp</MenuItem>
                  <MenuItem value={2}>dib</MenuItem>
                  <MenuItem value={3}>gif</MenuItem>
                  <MenuItem value={4}>ico</MenuItem>
                  <MenuItem value={5}>jfif</MenuItem>
                  <MenuItem value={6}>jpeg</MenuItem>
                  <MenuItem value={7}>jpg</MenuItem>
                  <MenuItem value={8}>pjp</MenuItem>
                  <MenuItem value={9}>pjpeg</MenuItem>
                  <MenuItem value={10}>png</MenuItem>
                  <MenuItem value={11}>svg</MenuItem>
                  <MenuItem value={12}>svgz</MenuItem>
                  <MenuItem value={13}>tif</MenuItem>
                  <MenuItem value={14}>tiff</MenuItem>
                  <MenuItem value={15}>webp</MenuItem>
                  <MenuItem value={16}>xbm</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                defaultValue={selectedImage.width}
                variant="filled"
                margin="dense"
                label="Width"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                defaultValue={selectedImage.height}
                variant="filled"
                margin="dense"
                label="Height"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained">
            Cancel
          </Button>
          <Button onClick={handleExport} variant="contained" color="primary">
            Export
          </Button>
        </DialogActions>
      </Dialog>
      <BackdropComponent open={loading} />
    </>
  );
}

export default ImageExportDialog;