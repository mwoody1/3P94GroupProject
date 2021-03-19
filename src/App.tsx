import React from 'react';
// import { ThemeOptions, ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeOptions, ThemeProvider, unstable_createMuiStrictModeTheme as createMuiTheme } from '@material-ui/core/styles';
import Main from './components/Main';
import { StateContext, initialProjectsState, Project } from './common/Context';
import { GlobalHotKeys, KeyMap } from 'react-hotkeys';

const theme: ThemeOptions = {
  palette: {
    type: 'dark',
    primary: {
      main: '#5ba1c2'
    },
    secondary: {
      main: '#b9f6ca'
    }
  }
}

const keyMap: KeyMap = {
  SHOW_HOTKEYS: { name: 'Show Hotkeys', sequence: 'shift+h', action: 'keydown' },
  SHOW_HELP: { name: 'Show Help', sequence: 'shift+?', action: 'keydown' },
  NEW_PROJECT: { name: 'New Project', sequence: 'shift+n', action: 'keydown' },
  OPEN_PROJECT: { name: 'Open Project', sequence: 'shift+o', action: 'keydown' },
  IMPORT_AUDIO: { name: 'Import Audio', sequence: 'shift+a', action: 'keydown' },
  IMPORT_IMAGES: { name: 'Import Images', sequence: 'shift+i', action: 'keydown' },
  IMPORT_VIDEOS: { name: 'Import Videos', sequence: 'shift+v', action: 'keydown' },
  SAVE_PROJECT: { name: 'Save Project', sequence: 'shift+s', action: 'keydown' },
  EXPORT_PROJECT: { name: 'Export Project', sequence: 'shift+e', action: 'keydown' }
}

const handlers = {
  SHOW_HOTKEYS: () => {
    let hotkeysButton = document.getElementById('hotkeysLink');
    if (hotkeysButton) hotkeysButton.click();
  },
  SHOW_HELP: () => {
    let helpButton = document.getElementById('helpLink');
    if (helpButton) helpButton.click();
  },
  NEW_PROJECT: (keyEvent?: KeyboardEvent | undefined) => {
    let newProjectButton = document.getElementById('new-project-button');
    keyEvent?.preventDefault(); // stops it from entering hotkey into autofocus field
    if (newProjectButton) newProjectButton.click();
  },
  OPEN_PROJECT: () => {
    let openProjectButton = document.getElementById('open-project-button');
    if (openProjectButton) openProjectButton.click();
  },
  IMPORT_AUDIO: () => {
    let audioInput = document.getElementById('audio-import');
    if (audioInput) {
      audioInput.click();
    } else {
      let homeButton = document.getElementById('homeLink');
      if (homeButton) homeButton.click();
    }
  },
  IMPORT_IMAGES: () => {
    let imageInput = document.getElementById('image-import');
    if (imageInput) {
      imageInput.click();
    } else {
      let homeButton = document.getElementById('homeLink');
      if (homeButton) homeButton.click();
    }
  },
  IMPORT_VIDEOS: () => {
    let videoInput = document.getElementById('video-import');
    if (videoInput) {
      videoInput.click();
    } else {
      let homeButton = document.getElementById('homeLink');
      if (homeButton) homeButton.click();
    }
  },
  SAVE_PROJECT: () => {
    let saveButton = document.getElementById('save-project-button');
    if (saveButton) {
      saveButton.click();
    }
  },
  EXPORT_PROJECT: (keyEvent?: KeyboardEvent | undefined) => {
    let exportButton = document.getElementById('export-project');
    keyEvent?.preventDefault(); // stops it from entering hotkey into autofocus field
    if (exportButton) {
      exportButton.click();
    } else {
      let homeButton = document.getElementById('homeLink');
      if (homeButton) homeButton.click();
    }
  }
}

const App = () => {
  const muiTheme = createMuiTheme(theme);
  const [currentProject, setCurrentProject] = React.useState<Project>(initialProjectsState.currentProject);
  const [projects, setProjects] = React.useState<Project[]>(initialProjectsState.projects);

  return (
    <ThemeProvider theme={muiTheme}>
      <StateContext.Provider value={{ projects, currentProject, setProjects, setCurrentProject }}>
        <SnackbarProvider maxSnack={3}>
          <GlobalHotKeys keyMap={keyMap} handlers={handlers} />
          <Router>
            <Main />
          </Router>
        </SnackbarProvider>
      </StateContext.Provider>
    </ThemeProvider>
  );
}

export default App;
