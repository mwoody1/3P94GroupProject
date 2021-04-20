import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import BackdropComponent from '../common/Backdrop';
import { ImageFileMeta } from '../common/Context';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { handleInputKeyPress } from '../App';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

type Props = {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  selectedImage: ImageFileMeta
  canvasImageRef: React.MutableRefObject<HTMLCanvasElement | null>
  imageExportWidth: number
  imageExportHeight: number
  setImageExportWidth: React.Dispatch<React.SetStateAction<number>>
  setImageExportHeight: React.Dispatch<React.SetStateAction<number>>
}

type MimeFileExtension = 'jpg' | 'png' | 'webp'

type MimeTypes = {
  [key in MimeFileExtension]: string
}

const mimeTypes: MimeTypes = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp"
}

const ImageExportDialog = ({ open, setOpen, selectedImage, canvasImageRef, imageExportWidth, imageExportHeight, setImageExportWidth, setImageExportHeight }: Props) => {
  const linkRef = React.useRef<HTMLAnchorElement>(null);
  const [fileName, setFileName] = React.useState(selectedImage.name.replace(/\.[^/.]+$/, ""));
  const [fileType, setFileType] = React.useState<MimeFileExtension>('png');
  const [useImageDefaults, setUseImageDefaults] = React.useState(true);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (useImageDefaults) {
      setImageExportWidth(selectedImage.width);
      setImageExportHeight(selectedImage.height);
    }
  }, [useImageDefaults, selectedImage, setImageExportWidth, setImageExportHeight]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleExport = () => {
    setLoading(true);
    setOpen(false);

    if (linkRef.current && canvasImageRef.current) {
      linkRef.current.href = canvasImageRef.current.toDataURL(mimeTypes[fileType]);
      linkRef.current.download = fileName;
      linkRef.current.click();
    }

    setLoading(false);
  };

  const handleFileTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFileType(event.target.value as MimeFileExtension);
  };

  const handleDimensionChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, type: 'width' | 'height') => {
    let input = Number(event.target.value);

    if (Number.isNaN(input)) return;

    input = Math.round(input);

    if (input === 0) return;

    if (type === 'width') setImageExportWidth(input);
    if (type === 'height') setImageExportHeight(input);
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} aria-labelledby="image-export-dialog">
        <DialogTitle id="image-export-dialog">Image Export Options</DialogTitle>
        <DialogContent>
          <DialogContentText>
            
          </DialogContentText>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={6}>
              <TextField
                autoFocus
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                variant="filled"
                margin="dense"
                label="File Name"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl>
                <InputLabel id="file-type">File Type</InputLabel>
                <Select
                  value={fileType}
                  onChange={handleFileTypeChange}
                  variant="filled"
                  margin="dense"
                  id="file-type"
                  label="File Type"
                >
                  {Object.keys(mimeTypes).map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
            <FormControlLabel
              control={
                <Switch
                  checked={useImageDefaults}
                  onKeyPress={handleInputKeyPress}
                  onChange={(_, checked) => setUseImageDefaults(checked)}
                  name="useVideoDefaults"
                  color="primary"
                />
              }
              label={`Use Original Dimensions (${selectedImage.width}x${selectedImage.height})`}
            />
          </Grid>
          <Grid item xs={12}>
            {!useImageDefaults && 
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  value={imageExportWidth}
                  onChange={(e) => handleDimensionChange(e, 'width')}
                  variant="filled"
                  margin="dense"
                  label="Width"
                  error={imageExportWidth > selectedImage.width}
                  helperText={imageExportWidth > selectedImage.width && 'Quality loss will occur because width is greater than original.'}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  value={imageExportHeight}
                  onChange={(e) => handleDimensionChange(e, 'height')}
                  variant="filled"
                  margin="dense"
                  label="Height"
                  error={imageExportHeight > selectedImage.height}
                  helperText={imageExportHeight > selectedImage.height && 'Quality loss will occur because height is greater than original.'}
                />
              </Grid>
            </Grid>
            }
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
          <a id="imageDownloadLink" ref={linkRef} href={'/#'} download> </a>
        </DialogActions>
      </Dialog>
      <BackdropComponent open={loading} />
    </>
  );
}

export default ImageExportDialog;