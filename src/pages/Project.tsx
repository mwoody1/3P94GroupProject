import React from 'react';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import { useProjects } from '../common/Context';
import AudioFilesTable from '../components/AudioFilesTable';
import CustomSlider from '../components/CustomSlider';
import ImageFilesTable from '../components/ImageFilesTable';
import VideoFilesTable from '../components/VideoFilesTable';
import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import Tooltip from '@material-ui/core/Tooltip';
import VideoExportDialog from '../components/VideoExportDialog';
import ImageExportDialog from '../components/ImageExportDialog';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { handleInputKeyPress } from '../App';
import { useSnackbar } from 'notistack';
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from 'video.js';

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
    videoSlider: {
      marginTop: theme.spacing(1)
    },
    buttons: {
      marginTop: theme.spacing(1)
    }
  })
);

const ValueLabelComponent = (props: Props) => {
  const { children, open, value } = props;

  return (
    <Tooltip open={open} enterTouchDelay={0} placement="bottom" arrow title={value}>
      {children}
    </Tooltip>
  );
}

const maxXsHeight = 200;
const maxSmHeight = 200;
const maxMdHeight = 300;
const maxLgHeight = 400;
const maxXlHeight = 400;

const maxXsHeightHiddenTables = 200;
const maxSmHeightHiddenTables = 400;
const maxMdHeightHiddenTables = 500;
const maxLgHeightHiddenTables = 600;
const maxXlHeightHiddenTables = 700;

const defaultBlur = 0;
const defaultHue = 0;
const defaultContrast = 100;
const defaultSaturation = 100;
const defaultBrightness = 100;

const playerOptions: VideoJsPlayerOptions = {
  aspectRatio: '16:9',
  autoplay: true,
  controls: true,
  controlBar: {
    pictureInPictureToggle: false,
  },
  loop: true,
  muted: true,
  // playbackRates: [0.25, 0.5, 1, 1.5, 2]
};

const Project = () => {
  const classes = useStyles();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { currentProject } = useProjects();
  const { selectedImage, selectedVideo, audioFiles, showMediaTables } = currentProject;
  const imageRef = React.useRef<HTMLImageElement | null>(null);
  // const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasImageRef = React.useRef<HTMLCanvasElement | null>(null);
  const [blur, setBlur] = React.useState<number>(defaultBlur);
  const [brightness, setBrightness] = React.useState<number>(defaultBrightness);
  const [contrast, setContrast] = React.useState<number>(defaultContrast);
  const [hue, setHue] = React.useState<number>(defaultHue);
  const [invert, setInvert] = React.useState(false)
  const [saturation, setSaturation] = React.useState<number>(defaultSaturation);
  const [greyscale, setGreyscale] = React.useState(false);
  const [tempRangeValue, setTempRangeValue] = React.useState<number[]>([0, 100]);
  const [rangeValue, setRangeValue] = React.useState<number[]>([0, 100]);
  const [imageExportWidth, setImageExportWidth] = React.useState(0);
  const [imageExportHeight, setImageExportHeight] = React.useState(0);
  const [imageExportOpen, setImageExportOpen] = React.useState(false);
  const [videoExportOpen, setVideoExportOpen] = React.useState(false);
  const [trickery, setTrickery] = React.useState(0);  // hack to get previously selected images to render immediately when switching projects (not needed for videos because we're not using canvas)
  const [player, setPlayer] = React.useState<VideoJsPlayer>();
  
  React.useEffect(() => {
    if (!videoRef.current) return;
  
    // if (player) {
    //   console.log('Player already initialized.');
    // } else {
    //   setPlayer(videojs(videoRef.current, playerOptions, () => {
    //     console.log("Player Ready.");
    //   }));
    // }

    // setPlayer(videojs(videoRef.current, playerOptions, () => {
    //   console.log("Player Ready.");
    // }));

    setPlayer(videojs(videoRef.current, playerOptions));

    // return () => {
    //   player?.dispose();
    // };
  }, [player, videoRef, selectedVideo]);

  React.useEffect(() => {
    // if (!player) return;
    if (!selectedVideo) return;

    // console.log("Player", player);
    if (!player) return;
    
    player.src({
      src: selectedVideo.src,
      type: selectedVideo.type
    })
  }, [player, selectedVideo]);

  const xs = useMediaQuery(theme.breakpoints.only('xs'));
  const sm = useMediaQuery(theme.breakpoints.only('sm'));
  const md = useMediaQuery(theme.breakpoints.only('md'));
  const lg = useMediaQuery(theme.breakpoints.only('lg'));
  const xl = useMediaQuery(theme.breakpoints.only('xl'));

  const maxHeight = React.useCallback(() => {
    if (showMediaTables) {
      if (xs) return maxXsHeight;
      if (sm) return maxSmHeight;
      if (md) return maxMdHeight;
      if (lg) return maxLgHeight;
      if (xl) return maxXlHeight;
    } else {
      if (xs) return maxXsHeightHiddenTables;
      if (sm) return maxSmHeightHiddenTables;
      if (md) return maxMdHeightHiddenTables;
      if (lg) return maxLgHeightHiddenTables;
      if (xl) return maxXlHeightHiddenTables;
    }
    
    return 200;
  }, [showMediaTables, xs, sm, md, lg, xl]);

  React.useEffect(() => {
    let image = imageRef.current;

    const listener = () => {
      setTrickery(trickery => trickery + 1);
    }

    if (selectedImage) {
      setImageExportWidth(selectedImage.width);
      setImageExportHeight(selectedImage.height);
    }
    
    image?.addEventListener('load', listener);

    return () => {
      image?.removeEventListener('load', listener);
    }
  }, [selectedImage, imageRef]);

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

    const timeListener = () => {
      if (!video) return;

      let duration = video.duration;
      if (duration && duration > 0) {
        if (video.currentTime < rangeValue[0] || video.currentTime > rangeValue[1]) {
          video.currentTime = rangeValue[0];
        }
      }
    }

    video.addEventListener('timeupdate', timeListener);

    return () => {
      video?.removeEventListener('timeupdate', timeListener);
    }

  }, [videoRef, rangeValue]);

  React.useEffect(() => {
    let image = imageRef.current;
    let canvas = canvasImageRef.current;

    if (!image || !canvas) return;

    let context = canvas.getContext("2d");

    if (!context) return;

    // apply filters here instead of using css because otherwise only the default image would be exported
    context.filter = `blur(${blur}px) brightness(${brightness}%) contrast(${contrast}%) grayscale(${greyscale ? 100 : 0}%) hue-rotate(${hue}deg) invert(${invert ? 100 : 0}%) saturate(${saturation}%)`;
    context.drawImage(image, 0, 0, imageExportWidth, imageExportHeight);

  }, [selectedImage, imageRef, canvasImageRef, trickery, blur, brightness, contrast, greyscale, hue, invert, saturation, imageExportWidth, imageExportHeight]);

  const reset = () => {
    setBlur(defaultBlur);
    setBrightness(defaultBrightness);
    setContrast(defaultContrast);
    setHue(defaultHue);
    setSaturation(defaultSaturation);
    setInvert(false);
    setGreyscale(false);
    if (selectedVideo) {
      setTempRangeValue([0, Number(selectedVideo.length)]);
      setRangeValue([0, Number(selectedVideo.length)]);
    }
    enqueueSnackbar('Values reset to defaults.');
  };

  const handleInvertChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInvert(event.target.checked);
  };

  const handleGreyscaleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGreyscale(event.target.checked);
  };

  const handleTempRangeChange = (event: any, newValue: number | number[]) => {
    setTempRangeValue(newValue as number[]);
  };

  const handleRangeChange = () => {
    setRangeValue(tempRangeValue);
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item md={showMediaTables ? 6 : 12} container justify="center" spacing={2}>
          {(selectedImage || selectedVideo) &&
            <>
              <Grid item xs={!showMediaTables ? 10 : 12}>
                {selectedImage &&
                  <>
                    <canvas
                      className={classes.hide}
                      ref={canvasImageRef}
                      width={imageExportWidth}
                      height={imageExportHeight}
                    >
                    </canvas>
                    <img 
                      ref={imageRef} 
                      src={selectedImage.src} 
                      width='100%' 
                      style={{ maxHeight: maxHeight(), objectFit: 'contain', filter: `blur(${blur}px) brightness(${brightness}%) contrast(${contrast}%) grayscale(${greyscale ? 100 : 0}%) hue-rotate(${hue}deg) invert(${invert ? 100 : 0}%) saturate(${saturation}%)` }} 
                      alt={selectedImage.name}>
                    </img>
                  </>
                }
                {selectedVideo &&
                  <>
                    {/* <video
                      playsInline
                      loop
                      controls
                      disablePictureInPicture
                      ref={videoRef}
                      controlsList="nodownload"
                      src={selectedVideo.src}
                      style={{ maxHeight: maxHeight(), filter: `blur(${blur}px) brightness(${brightness}%) contrast(${contrast}%) grayscale(${greyscale ? 100 : 0}%) hue-rotate(${hue}deg) invert(${invert ? 100 : 0}%) saturate(${saturation}%)` }}
                      width='100%'
                    >
                    </video> */}
                    {/* <div data-vjs-player style={{ width: '100%', height: maxHeight() }}>
                      <video
                        className="video-js vjs-fill"
                        ref={videoRef}
                        style={{ filter: `blur(${blur}px) brightness(${brightness}%) contrast(${contrast}%) grayscale(${greyscale ? 100 : 0}%) hue-rotate(${hue}deg) invert(${invert ? 100 : 0}%) saturate(${saturation}%)` }}
                      />
                    </div> */}
                    <div data-vjs-player>
                      <video
                        playsInline
                        className="video-js"
                        ref={videoRef}
                        style={{ filter: `blur(${blur}px) brightness(${brightness}%) contrast(${contrast}%) grayscale(${greyscale ? 100 : 0}%) hue-rotate(${hue}deg) invert(${invert ? 100 : 0}%) saturate(${saturation}%)` }}
                      />
                    </div>
                    <Slider
                      className={classes.videoSlider}
                      value={tempRangeValue}
                      onChange={handleTempRangeChange}
                      onChangeCommitted={handleRangeChange}
                      step={0.01}
                      // valueLabelDisplay="on"
                      valueLabelFormat={(x: number, i: number) => {
                        if (Number.isNaN(x)) return '00:00:00';
                        if (i === 0) {
                          return <Typography>{`Start: ${new Date(x * 1000).toISOString().substr(11, 12)}`}</Typography>;
                        } else {
                          return <Typography>{`End: ${new Date(x * 1000).toISOString().substr(11, 12)}`}</Typography>;
                        }
                      }}
                      ValueLabelComponent={ValueLabelComponent}
                      aria-labelledby="range-slider"
                      // max={videoRef.current?.duration}
                      max={Number(selectedVideo.length)}
                    />
                  </>
                }
              </Grid>
              <Grid item md={!showMediaTables && 2}>
                <>
                  <Grid item>
                    <CustomSlider title="Blur" value={blur} setValue={setBlur} defaultValue={defaultBlur} min={0} max={50} />
                    <CustomSlider title="Brightness" value={brightness} setValue={setBrightness} defaultValue={defaultBrightness} min={0} max={200} adornment='%' />
                    <CustomSlider title="Contrast" value={contrast} setValue={setContrast} defaultValue={defaultContrast} min={0} max={300} adornment='%' />
                    <CustomSlider title="Hue" value={hue} setValue={setHue} defaultValue={defaultHue} min={0} max={360} adornment='°' />
                    <CustomSlider title="Saturation" value={saturation} setValue={setSaturation} defaultValue={defaultSaturation} min={0} max={300} adornment='%' />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={invert}
                          onKeyPress={handleInputKeyPress}
                          onChange={handleInvertChange}
                          name="invert"
                          color="primary"
                        />
                      }
                      label="Invert"
                    />
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
                  <Grid item container className={classes.buttons} justify={showMediaTables ? "space-between" : "space-around"}>
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
        {showMediaTables &&
          <Grid item md={6} container spacing={2} direction="column">
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
        }
      </Grid>
      {selectedImage && 
        <ImageExportDialog 
          open={imageExportOpen} 
          setOpen={setImageExportOpen} 
          selectedImage={selectedImage} 
          canvasImageRef={canvasImageRef}
          imageExportWidth={imageExportWidth}
          imageExportHeight={imageExportHeight}
          setImageExportWidth={setImageExportWidth}
          setImageExportHeight={setImageExportHeight}
        />
      }
      {selectedVideo &&
        <VideoExportDialog
          open={videoExportOpen}
          setOpen={setVideoExportOpen}
          selectedVideo={selectedVideo}
          startTime={rangeValue[0]}
          endTime={rangeValue[1]}
          blur={blur}
          brightness={brightness}
          contrast={contrast}
          hue={hue}
          invert={invert}
          saturation={saturation}
          greyscale={greyscale}
          audioFiles={audioFiles}
        />
      }
    </>
  );
}

export default Project;
