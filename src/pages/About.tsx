import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const About = () => {

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <Typography variant="h3" gutterBottom>
          About
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="h5" gutterBottom>
          Video Editor for Group #22
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="body1" gutterBottom>
          This site allows for audio, images, and video files to be added to a project. Once added images and videos can be edited, saved, and/or exported. A project can be saved at anytime and new ones can be created. Previous projects can be opened also.
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>What actually works:</strong>
        </Typography>
        <ul>
          <li><Typography>Adding and removing audio, images, and videos</Typography></li>
          <li><Typography>Editing images and videos</Typography></li>
          <li><Typography>Converting and/or exporting edited images and videos</Typography></li>
          <li><Typography>Creating new projects</Typography></li>
          <li><Typography>Opening previously saved projects</Typography></li>
          <li><Typography>Renaming projects</Typography></li>
          <li><Typography>Resetting filters</Typography></li>
          <li><Typography>All keyboard shortcuts</Typography></li>
          <li><Typography>Responsive layout (while we don't recommend editing on mobile devices, it is possible, especially if the media tables are hidden after importing to free up space)</Typography></li>
        </ul>
        <Typography variant="body1" gutterBottom>
          <strong>What partially works:</strong>
        </Typography>
        <ul>
          <li><Typography>Saving projects: the project's name, current files, and the selected image/video will be saved, but not the filter values</Typography></li>
          <li>
            <Typography>Video Export:</Typography>
            <ul>
              <li><Typography>If an audio track is chosen over the default, it will replace the video audio instead of merge (ideally there would be an option to either merge or replace, but for now, it only replaces)</Typography></li>
              <li><Typography>The render progress is not always accurate when replacing sound and the mp4 format is chosen (it will often finish around 50%)</Typography></li>
              <li><Typography>The exported video won't be exactly like what is shown in the preview (blur and brightness will be somewhat close, but never exactly the same)</Typography></li>
            </ul>
          </li>
        </ul>
        <Typography variant="body1" gutterBottom>
          <strong>Known issues:</strong>
        </Typography>
        <ul>
          <li><Typography>Video Export: Safari is not supported for video exports (should work in Chrome, Firefox, Edge, and Opera).</Typography></li>
        </ul>
      </Grid>
    </Grid>
  );
}

export default About;