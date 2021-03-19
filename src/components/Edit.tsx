import React from 'react';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import { useProjects } from '../common/Context';
import AudioFilesTable from './AudioFilesTable';
import ColorSlider from './ColorSlider';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import ImageFilesTable from './ImageFilesTable';
import VideoFilesTable from './VideoFilesTable';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Slider from '@material-ui/core/Slider';
import Tooltip from '@material-ui/core/Tooltip';
import VideoExportDialog from './VideoExportDialog';
import ImageExportDialog from './ImageExportDialog';
import Typography from '@material-ui/core/Typography';
import { handlers } from '../App';

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
    }
  })
);

function ValueLabelComponent(props: Props) {
  const { children, open, value } = props;

  return (
    <Tooltip open={open} enterTouchDelay={0} placement="bottom" arrow title={value}>
      {children}
    </Tooltip>
  );
}

const maxMediaDisplayWidth = 1000;
const maxMediaDisplayHeight = 500;

const Edit = () => {
  const classes = useStyles();
  const { currentProject } = useProjects();
  const { selectedImage, selectedVideo } = currentProject;
  const imageRef = React.useRef<HTMLImageElement | null>(null);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const canvasRefImage = React.useRef<HTMLCanvasElement | null>(null);
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

      let bufferedEnd = video.buffered.end(video.buffered.length - 1);
      let duration = video.duration;

      if (duration && duration > 0) {
        setBuffer((bufferedEnd / duration) * 100);
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

        // background = [48,48,48]

        red = Math.round(48 * (1 - (opacity / 100)) + red * (opacity / 100));
        green = Math.round(48 * (1 - (opacity / 100)) + green * (opacity / 100));
        blue = Math.round(48 * (1 - (opacity / 100)) + blue * (opacity / 100));

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
  }, [selectedVideo, videoRef, canvasRef, redScale, greenScale, blueScale, brightness, opacity, greyscale]);

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

      // background = [48,48,48]

      red = Math.round(48 * (1 - (opacity / 100)) + red * (opacity / 100));
      green = Math.round(48 * (1 - (opacity / 100)) + green * (opacity / 100));
      blue = Math.round(48 * (1 - (opacity / 100)) + blue * (opacity / 100));

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
  }, [selectedImage, imageRef, canvasRefImage, redScale, greenScale, blueScale, brightness, opacity, greyscale]);

  const reset = () => {
    setRedScale(100);
    setGreenScale(100);
    setBlueScale(100);
    setBrightness(100);
    setOpacity(100);
    setGreyscale(false);
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

  const handleGreyscaleKeyPress = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    // triggers hotkeys manually because keybinds normally don't work for input fields
    if (event.shiftKey) {
      switch (event.key) {
        case 'H':
          handlers.SHOW_HOTKEYS();
          return;
        case '?':
          handlers.SHOW_HELP();
          return;
        case 'N':
          handlers.NEW_PROJECT(event.nativeEvent);
          return;
        case 'O':
          handlers.OPEN_PROJECT();
          return;
        case 'A':
          handlers.IMPORT_AUDIO();
          return;
        case 'I':
          handlers.IMPORT_IMAGES();
          return;
        case 'V':
          handlers.IMPORT_VIDEOS();
          return;
        case 'S':
          handlers.SAVE_PROJECT();
          return;
        case 'E':
          handlers.EXPORT_PROJECT(event.nativeEvent);
          return;
        default:
          return;
      }
    }
  }

  return (
    <>
      <Grid container justify="space-between" spacing={2}>
        <Grid item md={8} container direction="column">
          <Grid item>
            <AudioFilesTable />
          </Grid>
          <Grid item>
            <ImageFilesTable />
          </Grid>
          <Grid item>
            <VideoFilesTable />
          </Grid>
        </Grid>
        <Grid item md={4} container alignItems="center" direction="column">
        {(selectedImage || selectedVideo) ?
        <> 
          <Grid item>
            {selectedImage && <img className={classes.hide} ref={imageRef} src={selectedImage.src} width={Math.min(selectedImage.width, maxMediaDisplayWidth)} height={Math.min(selectedImage.height, maxMediaDisplayHeight)} alt={selectedImage.name}></img>}
            {selectedVideo && <video className={classes.hide} ref={videoRef} src={selectedVideo.src} width={Math.min(selectedVideo.width, maxMediaDisplayWidth)} height={Math.min(selectedVideo.height, maxMediaDisplayHeight)} loop={true} preload='auto' playsInline></video>}
          </Grid>
          <Grid item>
            <ColorSlider title="Red Scale" value={redScale} setValue={setRedScale} min={0} max={200} />
            <ColorSlider title="Green Scale" value={greenScale} setValue={setGreenScale} min={0} max={200} />
            <ColorSlider title="Blue Scale" value={blueScale} setValue={setBlueScale} min={0} max={200} />
            <ColorSlider title="Brightness" value={brightness} setValue={setBrightness} min={0} max={200} />
            <ColorSlider title="Opacity" value={opacity} setValue={setOpacity} min={0} max={100} />
            <FormControlLabel
              control={
                <Switch
                  checked={greyscale}
                  onKeyPress={handleGreyscaleKeyPress}
                  onChange={handleGreyscaleChange}
                  name="greyScale"
                  color="secondary"
                />
              }
              label="Greyscale"
            />
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={reset}>Reset</Button>
          </Grid>
        </>
        :
        <Grid item>
          <Typography variant="h5">Select a video or image to start editing</Typography>
        </Grid>
        }
        </Grid>
        {selectedImage && 
        <Grid item container justify="center" direction="column" alignItems="center">
          <Grid item>
            <canvas ref={canvasRefImage} width={Math.min(selectedImage.width, maxMediaDisplayWidth)} height={Math.min(selectedImage.height, maxMediaDisplayHeight)}></canvas>
          </Grid>
          <Button id="export-project" variant="contained" color="primary" onClick={() => setImageExportOpen(true)}>Export</Button>
        </Grid>
        }
        {selectedVideo && 
        <Grid item container justify="center" direction="column" alignItems="center">
          <Grid item>
            <canvas className={classes.pointer} ref={canvasRef} width={Math.min(selectedVideo.width, maxMediaDisplayWidth)} height={Math.min(selectedVideo.height, maxMediaDisplayHeight)} onClick={playPause}></canvas>
            <LinearProgress className={classes.progress} variant="buffer" color="secondary" value={progress} valueBuffer={buffer} onClick={(e) => seek(e)} />
            <Slider
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
          </Grid>
          <Grid item>
            {videoRef.current?.paused ? 
            <IconButton onClick={() => videoRef.current?.play()}>
              <PlayArrowIcon />
            </IconButton>
            :
            <IconButton onClick={() => videoRef.current?.pause()}>
              <PauseIcon />
            </IconButton>}
          </Grid>
          <Button id="export-project" variant="contained" color="primary" onClick={() => setVideoExportOpen(true)}>Export</Button>
        </Grid>
        }
      </Grid>
      {selectedImage && <ImageExportDialog open={imageExportOpen} setOpen={setImageExportOpen} selectedImage={selectedImage} />}
      {selectedVideo && <VideoExportDialog open={videoExportOpen} setOpen={setVideoExportOpen} selectedVideo={selectedVideo} />}
    </>
  );
}

export default Edit;
