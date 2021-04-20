import React from 'react';
// import { ThemeOptions, ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeOptions, ThemeProvider, unstable_createMuiStrictModeTheme as createMuiTheme } from '@material-ui/core/styles';
import Main from './components/Main';
import { StateContext, initialProjectsState, Project } from './common/Context';
import { GlobalHotKeys, KeyMap } from 'react-hotkeys';

const theme: ThemeOptions = {
  // breakpoints: {
  //   values: {
  //     xs: 0,
  //     sm: 600,
  //     md: 960,
  //     lg: 1280,
  //     xl: 1920,
  //   },
  // },
  palette: {
    type: 'dark',
    primary: {
      main: '#5ba1c2'
    },
    secondary: {
      main: '#b9f6ca'
    }
  },
  zIndex: {
    tooltip: 1299 //so they don't clip through dialogs
  },
  overrides: {
    MuiTableRow: {
      root: {
        cursor: 'pointer'
      }
    },
  }
}

const keyMap: KeyMap = {
  SHOW_HOTKEYS: { name: 'Show Hotkeys', sequence: 'shift+h', action: 'keydown' },
  SHOW_HELP: { name: 'Show Help', sequence: 'shift+?', action: 'keydown' },
  SHOW_ABOUT: { name: 'Show About', sequence: 'shift+b', action: 'keydown' },
  NEW_PROJECT: { name: 'New Project', sequence: 'shift+n', action: 'keydown' },
  OPEN_PROJECT: { name: 'Open Project', sequence: 'shift+o', action: 'keydown' },
  RENAME_PROJECT: { name: 'Rename Project', sequence: 'shift+r', action: 'keydown' },
  IMPORT_AUDIO: { name: 'Import Audio', sequence: 'shift+a', action: 'keydown' },
  IMPORT_IMAGES: { name: 'Import Images', sequence: 'shift+i', action: 'keydown' },
  IMPORT_VIDEOS: { name: 'Import Videos', sequence: 'shift+v', action: 'keydown' },
  RESET_OPTIONS: { name: 'Reset Options', sequence: 'shift+t', action: 'keydown' },
  SAVE_PROJECT: { name: 'Save Project', sequence: 'shift+s', action: 'keydown' },
  EXPORT_PROJECT: { name: 'Export Project', sequence: 'shift+e', action: 'keydown' }
}

export const handlers = {
  SHOW_HOTKEYS: () => {
    let hotkeysButton = document.getElementById('hotkeysLink');
    if (hotkeysButton) hotkeysButton.click();
  },
  SHOW_HELP: () => {
    let helpButton = document.getElementById('helpLink');
    if (helpButton) helpButton.click();
  },
  SHOW_ABOUT: () => {
    let aboutButton = document.getElementById('aboutLink');
    if (aboutButton) aboutButton.click();
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
  RENAME_PROJECT: (keyEvent?: KeyboardEvent | undefined) => {
    let renameProjectButton = document.getElementById('rename-project-button');
    keyEvent?.preventDefault(); // stops it from entering hotkey into autofocus field
    if (renameProjectButton) renameProjectButton.click();
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
  RESET_OPTIONS: () => {
    let resetButton = document.getElementById('reset-options-button');
    if (resetButton) {
      resetButton.click();
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

export const handleInputKeyPress = (event: React.KeyboardEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLDivElement>) => {
  // triggers hotkeys manually because keybinds normally don't work for input fields
  if (event.shiftKey) {
    switch (event.key) {
      case 'H':
        handlers.SHOW_HOTKEYS();
        return;
      case '?':
        handlers.SHOW_HELP();
        return;
      case 'B':
        handlers.SHOW_ABOUT();
        return;
      case 'N':
        handlers.NEW_PROJECT(event.nativeEvent);
        return;
      case 'O':
        handlers.OPEN_PROJECT();
        return;
      case 'R':
        handlers.RENAME_PROJECT(event.nativeEvent);
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
      case 'T':
        handlers.RESET_OPTIONS();
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
