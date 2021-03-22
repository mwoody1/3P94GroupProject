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
          <li><Typography>Creating new projects</Typography></li>
          <li><Typography>Opening previously saved projects</Typography></li>
          <li><Typography>Renaming projects</Typography></li>
          <li><Typography>Resetting values</Typography></li>
          <li><Typography>All keyboard shortcuts</Typography></li>
          <li><Typography>Responsive layout (while we don't recommend editing on mobile devices, it is possible, especially if the media tables are hidden after importing to free up space)</Typography></li>
        </ul>
        <Typography variant="body1" gutterBottom>
          <strong>What doesn't work:</strong>
        </Typography>
        <ul>
          <li><Typography>Editing audio or adding audio to videos</Typography></li>
          <li><Typography>Exporting (edited images and individual videos frames can only be saved as png files as described in the help page)</Typography></li>
        </ul>
        <Typography variant="body1" gutterBottom>
          <strong>What partially works:</strong>
        </Typography>
        <ul>
          <li><Typography>Saving projects: the project's name, current files, and the selected image/video will be saved, but not the editing values</Typography></li>
        </ul>
      </Grid>
    </Grid>
  );
}

export default About;