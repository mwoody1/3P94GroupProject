import React from 'react';
import { SnackbarProvider } from 'notistack';
// import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeOptions, ThemeProvider, unstable_createMuiStrictModeTheme as createMuiTheme } from '@material-ui/core/styles';
import Main from './components/Main';
import { FilesContext, files, AudioFileMeta, ImageFileMeta, VideoFileMeta } from './common/Context';

const theme: ThemeOptions = {
  palette: {
    type: 'dark',
    primary: {
      main: '#80d8ff'
    },
    secondary: {
      main: '#b9f6ca'
    }
  }
}
const App = () => {
  const muiTheme = createMuiTheme(theme);
  const [audioFiles, setAudioFiles] = React.useState<AudioFileMeta[]>(files.audioFiles);
  const [imageFiles, setImageFiles] = React.useState<ImageFileMeta[]>(files.imageFiles);
  const [videoFiles, setVideoFiles] = React.useState<VideoFileMeta[]>(files.videoFiles);
  const [selectedVideo, setSelectedVideo] = React.useState<VideoFileMeta | undefined>();

  return (
    <ThemeProvider theme={muiTheme}>
      <SnackbarProvider maxSnack={3}>
        <FilesContext.Provider value={{ audioFiles, imageFiles, videoFiles, selectedVideo, setAudioFiles, setImageFiles, setVideoFiles, setSelectedVideo }}>
          <Router>
            <Main />
          </Router>
        </FilesContext.Provider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
