import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

const Help = () => {
  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <Typography variant="h3" gutterBottom>
          Frequently Asked Questions
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="h5" gutterBottom>
          How do I upload media?
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="body1" gutterBottom>
          Audio, image, and video files can be uploaded by clicking the appropriate button or hotkey on the home page and selecting the file(s). Accepted formats for each file type are listed below. Alternatively if you'd like to use test media,
          click those buttons instead of the ones above.
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="body2" gutterBottom>
          &emsp;Audio formats: opus, flac, webm, weba, wav, ogg, m4a, oga, mid, mp3, aiff, wma, au
        </Typography>
        <Typography variant="body2" gutterBottom>
          &emsp;Image formats: tiff, pjp, jfif, gif, svg, bmp, png, jpeg, svgz, jpg, webp, ico, xbm, dib, tif, pjpeg, avif
        </Typography>
        <Typography variant="body2" gutterBottom>
          &emsp;Video formats: ogm, wmv, mpg, webm, ogv, mov, asx, mpeg, mp4, m4v, avi
        </Typography>
      </Grid>
      <Divider />
      <Grid item>
        <Typography variant="h5" gutterBottom>
          Are files actually uploaded?
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="body1" gutterBottom>
          No, nothing is actually uploaded or saved beyond the current session (refreshing the page will clear everything). In fact, if you're on a slow connection or are trying to watch data usage, it is advised to use your own media because it won't use any data as opposed
          to our test media, which will require additional downloads (20 MB for videos, 10 MB for images, 200 KB for audio).
        </Typography>
      </Grid>
      <Divider />
      <Grid item>
        <Typography variant="h5" gutterBottom>
          How can I remove media?
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="body1" gutterBottom>
          Each media file shown in the tables has a delete button (the trashcan icon) located on the far left. Clicking this will remove the file.
        </Typography>
      </Grid>
      <Divider />
      <Grid item>
        <Typography variant="h5" gutterBottom>
          What can I do after I upload?
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="body1" gutterBottom>
          After uploading, the media will appear on the main page with information about each file and a preview. Image and video files can be selected from this list by clicking on them. 
          They will appear below, along with sliders that can adjust the scales of each color (red, green, blue), brightness, opacity, background (if opacity is less than 100%) and a toggle for greyscale.
          Selected videos will also have the ability to select a clip by adjusting the two sliders under the video to the chosen start and end times.
          Videos can be started or stopped by either clicking the pause/play button beneath or by clicking on the video itself. You can seek to a certain spot in the video by clicking on the green progress bar underneath.
        </Typography>
      </Grid>
      <Divider />
      <Grid item>
        <Typography variant="h5" gutterBottom>
          What can I do with audio files?
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="body1" gutterBottom>
          Unfortunately this system doesn't currently allow for editing audio or adding audio to videos. At the moment audio files can only be imported, displayed, removed, and previewed in the audio files table and doesn't interact with anything else.
        </Typography>
      </Grid>
      <Divider />
      <Grid item>
        <Typography variant="h5" gutterBottom>
          Are files actually exported?
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="body1" gutterBottom>
          No, nothing will really be downloaded after exporting. It is possible to download an image after editing it by right clicking on it and choosing "Save image as...". This will create a png file of the image as it appears after editing.
          Unfortunately this will not work for entire videos, but can be done for a particular frame if you pause it and follow the steps above.
        </Typography>
      </Grid>
    </Grid>
  );
}

export default Help;