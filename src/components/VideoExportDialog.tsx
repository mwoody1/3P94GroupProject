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
import { VideoFileMeta } from '../common/Context';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

type Props = {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  selectedVideo: VideoFileMeta
}

const VideoExportDialog = ({ open, setOpen, selectedVideo }: Props) => {
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
      enqueueSnackbar('Video exported.', { variant: 'success' });
    }, 2000);
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
                defaultValue={selectedVideo.name.replace(/\.[^/.]+$/, "")}
                variant="filled"
                margin="dense"
                label="File Name"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl>
                <InputLabel id="file-type">File Type</InputLabel>
                <Select
                  defaultValue={4}
                  variant="filled"
                  margin="dense"
                  id="file-type"
                  label="File Type"
                >
                  <MenuItem value={0}>asx</MenuItem>
                  <MenuItem value={1}>avi</MenuItem>
                  <MenuItem value={2}>m4v</MenuItem>
                  <MenuItem value={3}>mov</MenuItem>
                  <MenuItem value={4}>mp4</MenuItem>
                  <MenuItem value={5}>mpeg</MenuItem>
                  <MenuItem value={6}>mpg</MenuItem>
                  <MenuItem value={7}>ogm</MenuItem>
                  <MenuItem value={8}>ogv</MenuItem>
                  <MenuItem value={9}>webm</MenuItem>
                  <MenuItem value={10}>wmv</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                defaultValue={selectedVideo.width}
                variant="filled"
                margin="dense"
                label="Width"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                defaultValue={selectedVideo.height}
                variant="filled"
                margin="dense"
                label="Height"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleExport} color="primary">
            Export
          </Button>
        </DialogActions>
      </Dialog>
      <BackdropComponent open={loading} />
    </>
  );
}

export default VideoExportDialog;