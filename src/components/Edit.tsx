import React from 'react';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import { useProjects } from '../common/Context';
import AudioFilesTable from './AudioFilesTable';
import ColorSlider from './ColorSlider';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import ImageFilesTable from './ImageFilesTable';
import VideoFilesTable from './VideoFilesTable';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Slider from '@material-ui/core/Slider';
import Tooltip from '@material-ui/core/Tooltip';
import VideoExportDialog from './VideoExportDialog';
import ImageExportDialog from './ImageExportDialog';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { handleInputKeyPress } from '../App';
import { convertHexToRGB } from '../common';
import { useSnackbar } from 'notistack';

interface Props {
  children: React.ReactElement;
  open: boolean;
  value: number;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    hide: {
      display: 'none'
    },
    pointer: {
      cursor: 'pointer'
    },
    progress: {
      cursor: 'pointer',
      marginBottom: theme.spacing(1),
      height: 15,
      opacity: 0.4,
      transition: '0.3s',
      '&:hover': {
        opacity: 1
      }
    },
    videoSlider: {
      marginTop: theme.spacing(3)
    },
    buttons: {
      marginTop: theme.spacing(1)
    },
  })
);

function ValueLabelComponent(props: Props) {
  const { children, open, value } = props;

  return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" arrow title={value}>
      {children}
    </Tooltip>
  );
}

const defaultXsWidth = 400;
const defaultXsHeight = 400;

const defaultSmWidth = 550;
const defaultSmHeight = 400;

const defaultMdWidth = 630;
const defaultMdHeight = 400;

const defaultLgWidth = 800;
const defaultLgHeight = 600;

const defaultXlWidth = 1200;
const defaultXlHeight = 800;

const Edit = () => {
  const classes = useStyles();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { currentProject } = useProjects();
  const { selectedImage, selectedVideo } = currentProject;
  const imageRef = React.useRef<HTMLImageElement | null>(null);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const canvasRefImage = React.useRef<HTMLCanvasElement | null>(null);
  const colorRef = React.useRef<HTMLInputElement | null>(null);
  const [redScale, setRedScale] = React.useState<number>(100);
  const [greenScale, setGreenScale] = React.useState<number>(100);
  const [blueScale, setBlueScale] = React.useState<number>(100);
  const [brightness, setBrightness] = React.useState<number>(100);
  const [opacity, setOpacity] = React.useState<number>(100);
  const [greyscale, setGreyscale] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [buffer, setBuffer] = React.useState(0);
  const [tempRangeValue, setTempRangeValue] = React.useState<number[]>([0,100]);
  const [rangeValue, setRangeValue] = React.useState<number[]>([0,100]);
  const [imageExportOpen, setImageExportOpen] = React.useState(false);
  const [videoExportOpen, setVideoExportOpen] = React.useState(false);
  const [maxMediaDisplayWidth, setMaxMediaDisplayWidth] = React.useState(400);
  const [maxMediaDisplayHeight, setMaxMediaDisplayHeight] = React.useState(400);
  const [hideMediaTables, setHideMediaTables] = React.useState(false);
  const [colorInputValue, setColorInputValue] = React.useState('#303030');
  const [opacityBackground, setOpacityBackground] = React.useState([48,48,48]);

  const xs = useMediaQuery(theme.breakpoints.only('xs'));
  const sm = useMediaQuery(theme.breakpoints.only('sm'));
  const md = useMediaQuery(theme.breakpoints.only('md'));
  const lg = useMediaQuery(theme.breakpoints.only('lg'));
  const xl = useMediaQuery(theme.breakpoints.only('xl'));

  React.useEffect(() => {
    if (xs) {
      setMaxMediaDisplayWidth(defaultXsWidth);
      setMaxMediaDisplayHeight(defaultXsHeight);
    }
    if (sm) {
      setMaxMediaDisplayWidth(defaultSmWidth);
      setMaxMediaDisplayHeight(defaultSmHeight);
    }
    if (md) {
      setMaxMediaDisplayWidth(defaultMdWidth);
      setMaxMediaDisplayHeight(defaultMdHeight);
    }
    if (lg) {
      setMaxMediaDisplayWidth(defaultLgWidth);
      setMaxMediaDisplayHeight(defaultLgHeight);
    }
    if (xl) {
      setMaxMediaDisplayWidth(defaultXlWidth);
      setMaxMediaDisplayHeight(defaultXlHeight);
    }
  }, [xs, sm, md, lg, xl]);

  React.useEffect(() => {
    if (!colorInputValue) return;

    let background = convertHexToRGB(colorInputValue);

    setOpacityBackground(background);
  },[colorInputValue]);

  React.useEffect(() => {
    if (selectedVideo) {
      let number = Number(selectedVideo.length);
      if (Number.isNaN(number)) return;

      setTempRangeValue([0, Number(selectedVideo.length)])
      setRangeValue([0, Number(selectedVideo.length)])
    }
  }, [selectedVideo]);

  React.useEffect(() => {
    let video = videoRef.current;

    if (!video) return;

    const bufferListener = () => {
      if (!video) return;

      try {
        let bufferedEnd = video.buffered.end(video.buffered.length - 1);
        let duration = video.duration;

        if (duration && duration > 0) {
          setBuffer((bufferedEnd / duration) * 100);
        }
      } catch (err) {
        // something went wrong accessing buffer, just ignore and continue
      }
    }

    const timeListener = () => {
      if (!video) return;

      let duration = video.duration;
      if (duration && duration > 0) {
        setProgress((video?.currentTime / duration) * 100);
       
        if (video.currentTime < rangeValue[0] || video.currentTime > rangeValue[1]) {
          video.currentTime = rangeValue[0];
        } 
      }
    }

    video.addEventListener('progress', bufferListener);
    video.addEventListener('timeupdate', timeListener);

    return () => {
      video?.removeEventListener('progress', bufferListener);
      video?.removeEventListener('timeupdate', timeListener);
    }

  }, [videoRef, rangeValue]);

  React.useEffect(() => {
    let video = videoRef.current;
    let canvas = canvasRef.current;
    
    if (!video || !canvas) return;

    let context = canvas.getContext("2d");
  
    const timerCallback = () => {
      if (video!.paused || video!.ended) {
        return;
      }
      computeFrame();
      
      // setTimeout(function () {
      //   timerCallback();
      // }, 16); // roughly 60 frames per second
      requestAnimationFrame(() => {
        timerCallback();
      })
    }
  
    const computeFrame = () => {
      if (!video || !context) return;

      context.drawImage(video, 0, 0, video.width, video.height);
      let frame = context.getImageData(0, 0, video.width, video.height);
      let l = frame.data.length / 4;
      
      for (let i = 0; i < l; i++) {
        let red = Math.min(frame.data[i * 4 + 0] * (redScale / 100), 255);
        let green = Math.min(frame.data[i * 4 + 1] * (greenScale / 100), 255);
        let blue = Math.min(frame.data[i * 4 + 2] * (blueScale / 100), 255);

        red = Math.min(red * (brightness / 100), 255);
        green = Math.min(green * (brightness / 100), 255);
        blue = Math.min(blue * (brightness / 100), 255);

        red = Math.round(opacityBackground[0] * (1 - (opacity / 100)) + red * (opacity / 100));
        green = Math.round(opacityBackground[1] * (1 - (opacity / 100)) + green * (opacity / 100));
        blue = Math.round(opacityBackground[2] * (1 - (opacity / 100)) + blue * (opacity / 100));

        if (greyscale) {
          let grey = (red + green + blue) / 3;
          frame.data[i * 4 + 0] = grey;
          frame.data[i * 4 + 1] = grey;
          frame.data[i * 4 + 2] = grey;
        } else {
          frame.data[i * 4 + 0] = red;
          frame.data[i * 4 + 1] = green;
          frame.data[i * 4 + 2] = blue;
        }
      }
      context.putImageData(frame, 0, 0);
  
      return;
    }
    video.pause();
    video.addEventListener("play", timerCallback, false);

    setTimeout(() => {  
      video?.play();
    }, 5);

    return () => {
      if (video) {
        video.removeEventListener("play", timerCallback);
      }
    }
  }, [maxMediaDisplayWidth, maxMediaDisplayHeight, selectedVideo, videoRef, canvasRef, redScale, greenScale, blueScale, brightness, opacity, opacityBackground, greyscale]);

  React.useEffect(() => {
    let image = imageRef.current;
    let canvas = canvasRefImage.current;
    
    if (!image || !canvas) return;
    
    let context = canvas.getContext("2d");

    if (!context) return;
    
    context.drawImage(image, 0, 0, image.width, image.height);
    let frame = context.getImageData(0, 0, image.width, image.height);
    let l = frame.data.length / 4;
    
    for (let i = 0; i < l; i++) {
      let red = Math.min(frame.data[i * 4 + 0] * (redScale / 100), 255);
      let green = Math.min(frame.data[i * 4 + 1] * (greenScale / 100), 255);
      let blue = Math.min(frame.data[i * 4 + 2] * (blueScale / 100), 255);

      red = Math.min(red * (brightness / 100), 255);
      green = Math.min(green * (brightness / 100), 255);
      blue = Math.min(blue * (brightness / 100), 255);

      red = Math.round(opacityBackground[0] * (1 - (opacity / 100)) + red * (opacity / 100));
      green = Math.round(opacityBackground[1] * (1 - (opacity / 100)) + green * (opacity / 100));
      blue = Math.round(opacityBackground[2] * (1 - (opacity / 100)) + blue * (opacity / 100));

      if (greyscale) {
        let grey = (red + green + blue) / 3;
        frame.data[i * 4 + 0] = grey;
        frame.data[i * 4 + 1] = grey;
        frame.data[i * 4 + 2] = grey;
      } else {
        frame.data[i * 4 + 0] = red;
        frame.data[i * 4 + 1] = green;
        frame.data[i * 4 + 2] = blue;
      }
    }
    context.putImageData(frame, 0, 0);
  }, [maxMediaDisplayWidth, maxMediaDisplayHeight, selectedImage, imageRef, canvasRefImage, redScale, greenScale, blueScale, brightness, opacity, opacityBackground, greyscale]);

  const reset = () => {
    let colorInput = colorRef.current;
    if (xs) {
      setMaxMediaDisplayWidth(defaultXsWidth);
      setMaxMediaDisplayHeight(defaultXsHeight);
    }
    if (sm) {
      setMaxMediaDisplayWidth(defaultSmWidth);
      setMaxMediaDisplayHeight(defaultSmHeight);
    }
    if (md) {
      setMaxMediaDisplayWidth(defaultMdWidth);
      setMaxMediaDisplayHeight(defaultMdHeight);
    }
    if (lg) {
      setMaxMediaDisplayWidth(defaultLgWidth);
      setMaxMediaDisplayHeight(defaultLgHeight);
    }
    if (xl) {
      setMaxMediaDisplayWidth(defaultXlWidth);
      setMaxMediaDisplayHeight(defaultXlHeight);
    }
    
    if (colorInput) colorInput.value = '#303030';
    setRedScale(100);
    setGreenScale(100);
    setBlueScale(100);
    setBrightness(100);
    setOpacity(100);
    setOpacityBackground([48,48,48]);
    setGreyscale(false);
    enqueueSnackbar('Values reset to defaults.');
  }

  const handleGreyscaleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGreyscale(event.target.checked);
  };

  const handleTempRangeChange = (event: any, newValue: number | number[]) => {
    setTempRangeValue(newValue as number[]);
  };

  const playPause = () => {
    if (videoRef.current?.paused) {
      videoRef.current?.play();
    } else {
      videoRef.current?.pause();
    }
  }

  const toggleMute = () => {
    let video = videoRef.current;

    if (video) {
      if (video.muted) {
        video.muted = false;
      } else {
        video.muted = true;
      }
    }
  }


  const seek = (event: any) => {
    let x = event.nativeEvent.layerX;
    let video = videoRef.current;

    if (!x || !video || Number.isNaN(video.duration)) return;

    let seekTime = (x / video.width) * video.duration;

    if (seekTime > rangeValue[0] && seekTime < rangeValue[1]) {
      video.currentTime = seekTime;
    }
  }

  const handleRangeChange = () => {
    setRangeValue(tempRangeValue);
  }

  const handleDimensionChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, type: 'width' | 'height') => {
    let input = Number(event.target.value);

    if (Number.isNaN(input)) return;

    if (input === 0) return;

    if (type === 'width') setMaxMediaDisplayWidth(input);
    if (type === 'height') setMaxMediaDisplayHeight(input);
  }

  return (
    <>
      <Grid container justify="space-between" spacing={2}>
        <Grid item container direction="column">
          <FormControlLabel
            control={
              <Switch
                checked={hideMediaTables}
                onKeyPress={handleInputKeyPress}
                onChange={(e, checked) => setHideMediaTables(checked)}
                name="hideMediaTables"
              />
            }
            label="Hide Media Tables"
          />
          {!hideMediaTables &&
          <>
            <Grid item>
              <AudioFilesTable />
            </Grid>
            <Grid item>
              <ImageFilesTable />
            </Grid>
            <Grid item>
              <VideoFilesTable />
            </Grid>
          </>
          }
        </Grid>
        <Grid item container justify="center" alignItems="center" spacing={4}>
        {(selectedImage || selectedVideo) &&
        <>
          <Grid item>
            {selectedImage && <canvas ref={canvasRefImage} width={Math.min(selectedImage.width, maxMediaDisplayWidth)} height={Math.min(selectedImage.height, maxMediaDisplayHeight)}></canvas>}
            {selectedVideo && 
            <>
              <canvas className={classes.pointer} ref={canvasRef} width={Math.min(selectedVideo.width, maxMediaDisplayWidth)} height={Math.min(selectedVideo.height, maxMediaDisplayHeight)} onClick={playPause}></canvas>
              <LinearProgress className={classes.progress} variant="buffer" color="secondary" value={progress} valueBuffer={buffer} onClick={(e) => seek(e)} />
              <Slider
                className={classes.videoSlider}
                value={tempRangeValue}
                onChange={handleTempRangeChange}
                onChangeCommitted={handleRangeChange}
                valueLabelDisplay="on"
                valueLabelFormat={(x: number) => {
                  if (Number.isNaN(x)) return '00:00:00';
                  return new Date(x * 1000).toISOString().substr(11, 8)
                }}
                ValueLabelComponent={ValueLabelComponent}
                aria-labelledby="range-slider"
                max={videoRef.current?.duration}
              />
              <Grid container justify="center">
                {videoRef.current?.paused ?
                <IconButton onClick={() => videoRef.current?.play()}>
                  <PlayArrowIcon />
                </IconButton>
                :
                <IconButton onClick={() => videoRef.current?.pause()}>
                  <PauseIcon />
                </IconButton>}
                <IconButton onClick={toggleMute}>
                  {videoRef.current?.muted ? <VolumeOffIcon /> : <VolumeUpIcon />}
                </IconButton>
              </Grid>
            </>
            }
          </Grid>
          <Grid item>
            <> 
              <Grid item>
                {selectedImage && <img className={classes.hide} ref={imageRef} src={selectedImage.src} width={Math.min(selectedImage.width, maxMediaDisplayWidth)} height={Math.min(selectedImage.height, maxMediaDisplayHeight)} alt={selectedImage.name}></img>}
                {selectedVideo && <video className={classes.hide} ref={videoRef} src={selectedVideo.src} width={Math.min(selectedVideo.width, maxMediaDisplayWidth)} height={Math.min(selectedVideo.height, maxMediaDisplayHeight)} loop={true} preload='auto' playsInline></video>}
              </Grid>
              <Grid item>
                <div>
                  <TextField
                    value={maxMediaDisplayWidth}
                    onKeyPress={handleInputKeyPress}
                    onChange={(e) => handleDimensionChange(e, 'width')}
                    variant="filled"
                    margin="dense"
                    label="Width (px)"
                    helperText={`Max: ${selectedVideo ? selectedVideo.width : selectedImage && selectedImage.width}px (original size)`}
                    type="number"
                  />
                </div>
                <div>
                  <TextField
                    value={maxMediaDisplayHeight}
                    onKeyPress={handleInputKeyPress}
                    onChange={(e) => handleDimensionChange(e, 'height')}
                    variant="filled"
                    margin="dense"
                    label="Height (px)"
                    helperText={`Max: ${selectedVideo ? selectedVideo.height : selectedImage && selectedImage.height}px (original size)`}
                    type="number"
                  />
                </div>
                <ColorSlider title="Red Scale" value={redScale} setValue={setRedScale} min={0} max={200} />
                <ColorSlider title="Green Scale" value={greenScale} setValue={setGreenScale} min={0} max={200} />
                <ColorSlider title="Blue Scale" value={blueScale} setValue={setBlueScale} min={0} max={200} />
                <ColorSlider title="Brightness" value={brightness} setValue={setBrightness} min={0} max={200} />
                <ColorSlider title="Opacity" value={opacity} setValue={setOpacity} min={0} max={100} />
                <div>
                  <label htmlFor="background-color">
                    <Typography>Background Color</Typography>
                  </label>
                  <input ref={colorRef} id="background-color" type="color" defaultValue={colorInputValue} onBlur={(e) => setColorInputValue(e.target.value)}></input>
                </div>
                <FormControlLabel
                  control={
                    <Switch
                      checked={greyscale}
                      onKeyPress={handleInputKeyPress}
                      onChange={handleGreyscaleChange}
                      name="greyScale"
                      color="primary"
                    />
                  }
                  label="Greyscale"
                />
              </Grid>
              <Grid item container className={classes.buttons} justify="space-between">
                <Grid item>
                  <Tooltip title="Resets the values above to their defaults" arrow>
                    <Button id="reset-options-button" variant="contained" onClick={reset}>Reset</Button>
                  </Tooltip>
                </Grid>
                <Grid item>
                  {selectedImage && 
                  <Tooltip title="Exports this image" arrow>
                    <Button id="export-project" variant="contained" color="primary" onClick={() => setImageExportOpen(true)}>Export</Button>
                  </Tooltip>
                  }
                  {selectedVideo && 
                    <Tooltip title="Exports this video" arrow>
                      <Button id="export-project" variant="contained" color="primary" onClick={() => setVideoExportOpen(true)}>Export</Button>
                    </Tooltip>
                  }
                </Grid>
              </Grid>
            </>
          </Grid>
        </>
        }
        {!selectedImage && !selectedVideo &&
        <Grid item>
          <Typography variant="h5">Select a video or image to start editing</Typography>
        </Grid>
        }
        </Grid>
      </Grid>
      {selectedImage && <ImageExportDialog open={imageExportOpen} setOpen={setImageExportOpen} selectedImage={selectedImage} />}
      {selectedVideo && <VideoExportDialog open={videoExportOpen} setOpen={setVideoExportOpen} selectedVideo={selectedVideo} />}
    </>
  );
}

export default Edit;
