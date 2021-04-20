import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { AudioFileMeta, VideoFileMeta } from '../common/Context';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { scaleBetween } from '../common';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { handleInputKeyPress } from '../App';
import Typography from '@material-ui/core/Typography';
import { isSafari } from 'react-device-detect';

type Props = {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  selectedVideo: VideoFileMeta
  startTime: number
  endTime: number
  blur: number
  brightness: number
  contrast: number
  hue: number
  saturation: number
  invert: boolean
  greyscale: boolean
  audioFiles: AudioFileMeta[]
}

type OutputFileTypes = 'mp4' | 'webm'

type FileDetails = {
  [key in OutputFileTypes]: string
}

type OutputOptions = {
  fileName: string
  fileType: OutputFileTypes
  width: number
  height: number
}

const outputLibraries: FileDetails = {
  mp4: 'libx264',
  webm: 'libvpx',
}

const mediaTypes: FileDetails = {
  mp4: 'video/mp4',
  webm: 'video/webm',
}

const ts2sec = (ts: string) => {
  const [h, m, s] = ts.split(':');
  return (parseFloat(h) * 60 * 60) + (parseFloat(m) * 60) + parseFloat(s);
};

const VideoExportDialog = ({ open, setOpen, selectedVideo, startTime, endTime, blur, brightness, contrast, hue, saturation, invert, greyscale, audioFiles }: Props) => {
  const [outputOptions, setOutputOptions] = React.useState<OutputOptions>({
    fileName: selectedVideo.name.replace(/\.[^/.]+$/, ""),
    fileType: 'mp4',
    width: selectedVideo.width,
    height: selectedVideo.height
  });
  const [selectedAudioSrc, setSelectedAudioSrc] = React.useState('Default');
  const [useVideoDefaults, setUseVideoDefaults] = React.useState(true);
  const [status, setStatus] = React.useState('Finished');
  const [currentProgress, setCurrentProgress] = React.useState(0);
  const [overallProgress, setOverallProgress] = React.useState(0);
  const linkRef = React.useRef<HTMLAnchorElement>(null);
  const ffmpeg = React.useMemo(() => {
    return createFFmpeg({
      // log: true,
      logger: ({ message, type }) => {
        let timeIndex = message.indexOf('time=');
        if (timeIndex) {
          let time = message.substr(timeIndex + 5, 11);
          if (time.includes(':') && time.includes('.')) {
            let seconds = ts2sec(time);
            if (seconds > 0) setCurrentProgress(seconds);
          }
        }
      },
      // progress: ({ ratio }) => {
      //   if (ratio > 0) setProgress(`Render Progress: ${(ratio * 100.0).toFixed(2)}%`);
      // }
    });
  }, []);

  let filters = `boxblur=${blur * 3}:1,eq=contrast=${contrast / 100}:saturation=${(contrast / 100) * (saturation / 100)}:brightness=${scaleBetween(brightness, -0.5, 0.5, 0, 200)},hue=h=${hue}`;

  if (invert) filters += ',negate';
  if (greyscale) filters += ',format=gray';
  if (!useVideoDefaults) filters += `,scale=${outputOptions.width}x${outputOptions.height}`;

  let flags = ['-ss', `${startTime}`, '-i', selectedVideo.name];

  if (selectedAudioSrc !== 'Default') flags = flags.concat(['-i', 'temp_audio', '-map', '0:v:0', '-map', '1:a:0']);

  flags = flags.concat('-filter_complex', filters, '-t', `${endTime - startTime}`, '-c:v', outputLibraries[outputOptions.fileType], `${outputOptions.fileName}_temp.${outputOptions.fileType}`);

  const options = {
    args: flags,
    inFilename: selectedVideo.name,
    outFilename: `${outputOptions.fileName}_temp.${outputOptions.fileType}`,
    mediaType: mediaTypes[outputOptions.fileType],
  }

  React.useEffect(() => {
    setOutputOptions(outputOptions => ({...outputOptions, fileName: selectedVideo.name.replace(/\.[^/.]+$/, ""), width: selectedVideo.width, height: selectedVideo.height}));
    setSelectedAudioSrc('Default');
  }, [selectedVideo]);

  React.useEffect(() => {
    if (useVideoDefaults) {
      setOutputOptions(outputOptions => ({...outputOptions, width: selectedVideo.width, height: selectedVideo.height}));
    }
  }, [useVideoDefaults, selectedVideo]);

  React.useEffect(() => {
    if (audioFiles.filter(audio => audio.src === selectedAudioSrc).length === 0) {
      setSelectedAudioSrc('Default');
    }
  }, [audioFiles, selectedAudioSrc]);

  React.useEffect(() => {
    if (currentProgress === 0) return;
    let roundedPercentage = Math.round(((startTime + currentProgress) / endTime) * 100 * 100 + Number.EPSILON) / 100;
    if (roundedPercentage > 0 && roundedPercentage < 100) {
      setOverallProgress(roundedPercentage);
    }
    if (roundedPercentage >= 100) {
      setOverallProgress(100);
    }
  }, [currentProgress, startTime, endTime]);

  const handleExport = async () => {
    setOverallProgress(0);
    setCurrentProgress(0);
    setStatus('Preparing...');
    console.time('render');
    if (!ffmpeg.isLoaded()) await ffmpeg.load();
    setStatus('Writing file to memory...');
    ffmpeg.FS('writeFile', options.inFilename, await fetchFile(selectedVideo.src));
    if (selectedAudioSrc) ffmpeg.FS('writeFile', 'temp_audio', await fetchFile(selectedAudioSrc));
    setStatus('Rendering...');
    await ffmpeg.run(...options.args);
    console.timeEnd('render');
    setStatus('Finished');
    const data = ffmpeg.FS('readFile', options.outFilename);
    if (linkRef.current) {
      linkRef.current.href = (URL.createObjectURL(new Blob([data.buffer], { type: options.mediaType })));
      linkRef.current.download = outputOptions.fileName;
      linkRef.current.click();
    }
    ffmpeg.FS('unlink', options.outFilename); // frees up memory to avoid possible memory error
    if (selectedAudioSrc) ffmpeg.FS('unlink', 'temp_audio');
  };

  // const handleAudioExport = async () => {
  //   setOverallProgress(0);
  //   setCurrentProgress(0);
  //   setStatus('Preparing...');
  //   if (!ffmpeg.isLoaded()) await ffmpeg.load();
  //   setStatus('Writing file to memory...');
  //   ffmpeg.FS('writeFile', options.inFilename, await fetchFile(selectedVideo.src));
  //   if (selectedAudioSrc) ffmpeg.FS('writeFile', 'temp_audio', await fetchFile(selectedAudioSrc));
  //   setStatus('Rendering...');
  //   await ffmpeg.run('-i', selectedVideo.name, '-vn', '-c:a', 'copy', options.outFilename)
  //   setStatus('Finished');
  //   const data = ffmpeg.FS('readFile', options.outFilename);
  //   if (linkRef.current) {
  //     linkRef.current.href = (URL.createObjectURL(new Blob([data.buffer], { type: 'audio/m4a' })));
  //     linkRef.current.download = `${outputOptions.fileName}.m4a`;
  //     linkRef.current.click();
  //   }
  //   ffmpeg.FS('unlink', options.outFilename); // frees up memory to avoid possible memory error
  //   if (selectedAudioSrc) ffmpeg.FS('unlink', 'temp_audio');
  // };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFileTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setOutputOptions({...outputOptions, fileType: event.target.value as OutputFileTypes});
  };

  const handleAudioChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedAudioSrc(event.target.value as string);
  };

  const handleDimensionChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, type: 'width' | 'height') => {
    let input = Number(event.target.value);

    if (Number.isNaN(input)) return;

    input = Math.round(input);

    if (input === 0) return;

    if (type === 'width') setOutputOptions({...outputOptions, width: input});
    if (type === 'height') setOutputOptions({...outputOptions, height: input});
  };

  const handleDimensionCheck = () => {
    if (outputOptions.width % 2 !== 0) {
      setOutputOptions({...outputOptions, width: outputOptions.width + 1});
    }
    if (outputOptions.height % 2 !== 0) {
      setOutputOptions({...outputOptions, height: outputOptions.height + 1});
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="video-export-dialog">
      <DialogTitle id="video-export-dialog">Video Export Options</DialogTitle>
      <DialogContent>
        <DialogContentText>
          
        </DialogContentText>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6}>
            <TextField
              autoFocus
              variant="filled"
              margin="dense"
              label="File Name"
              value={outputOptions.fileName}
              onChange={(e) => setOutputOptions({...outputOptions, fileName: e.target.value})}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl>
              <InputLabel id="file-type">File Type</InputLabel>
              <Select
                value={outputOptions.fileType}
                variant="filled"
                margin="dense"
                id="file-type"
                label="File Type"
                onChange={handleFileTypeChange}
              >
                {Object.keys(outputLibraries).map(fileType => <MenuItem key={fileType} value={fileType}>{fileType}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <FormControlLabel
              control={
                <Switch
                  checked={useVideoDefaults}
                  onKeyPress={handleInputKeyPress}
                  onChange={(_, checked) => setUseVideoDefaults(checked)}
                  name="useVideoDefaults"
                  color="primary"
                />
              }
              label={`Use Original Dimensions (${selectedVideo.width}x${selectedVideo.height})`}
            />
          </Grid>
          <Grid item xs={12}>
            {!useVideoDefaults && 
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  value={outputOptions.width}
                  onChange={(e) => handleDimensionChange(e, 'width')}
                  onBlur={handleDimensionCheck}
                  variant="filled"
                  margin="dense"
                  label="Width"
                  error={outputOptions.width > selectedVideo.width}
                  helperText={outputOptions.width > selectedVideo.width && 'Quality loss will occur because width is greater than original.'}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  value={outputOptions.height}
                  onChange={(e) => handleDimensionChange(e, 'height')}
                  onBlur={handleDimensionCheck}
                  variant="filled"
                  margin="dense"
                  label="Height"
                  error={outputOptions.height > selectedVideo.height}
                  helperText={outputOptions.height > selectedVideo.height && 'Quality loss will occur because height is greater than original.'}
                />
              </Grid>
            </Grid>
            }
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id="selected-audio">Audio</InputLabel>
              <Select
                value={selectedAudioSrc}
                variant="filled"
                margin="dense"
                id="selected-audio"
                label="Audio"
                onChange={handleAudioChange}
              >
                <MenuItem value='Default'>Default</MenuItem>
                {audioFiles.map((file, index) => <MenuItem key={index} value={file.src}>{file.name}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <a id="downloadLink" ref={linkRef} href={'/#'} download> </a>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained">
          Close
        </Button>
        <Button disabled={status !== 'Finished' || isSafari} onClick={handleExport} variant="contained" color="primary">
          Export
        </Button>
        {/* <Button disabled={status !== 'Finished'} onClick={handleAudioExport} variant="contained" color="primary">
          Export Audio only
        </Button> */}
        {isSafari && <Typography>Unfortunately this export is not supported by Safari. Please use either Chrome, Edge, Firefox, or Opera to export.</Typography>}
        {status !== 'Finished' && <Typography>{status}</Typography>}
        {status === 'Rendering...' && <Typography>{`${overallProgress}%`}</Typography>}
      </DialogActions>
    </Dialog>
  );
}

export default VideoExportDialog;
