import React, { ReactNode } from 'react';
import clsx from 'clsx';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import { createStyles, makeStyles, useTheme, Theme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import SettingsIcon from '@material-ui/icons/Settings';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { useSnackbar } from 'notistack';
import { useProjects } from '../common/Context';
import AddIcon from '@material-ui/icons/Add';
import FolderIcon from '@material-ui/icons/Folder';
import Backdrop from '../common/Backdrop';
import { convertHexToRGBA } from '../common';
import HomeIcon from '@material-ui/icons/Home';
import KeyboardIcon from '@material-ui/icons/Keyboard';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import HelpIcon from '@material-ui/icons/Help';
import InfoIcon from '@material-ui/icons/Info';
import NewProjectDialog from './NewProjectDialog';
import OpenProjectDialog from './OpenProjectDialog';
import Tooltip from '@material-ui/core/Tooltip';
import RenameProjectDialog from './RenameProjectDialog';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { handleInputKeyPress } from '../App';

type SideDrawerProps = {
  children: ReactNode
}


interface ListItemLinkProps {
  id?: string
  icon?: React.ReactElement;
  primary: string;
  to: string;
  tooltip?: string;
  onClick?: () => void;
}

const ListItemLink = (props: ListItemLinkProps) => {
  const { id, icon, primary, to, tooltip, onClick } = props;

  const renderLink = React.useMemo(
    () =>
      React.forwardRef<any, Omit<RouterLinkProps, 'to'>>((itemProps, ref) => (
        <RouterLink to={to} ref={ref} {...itemProps} />
      )),
    [to],
  );

  return (
    <Tooltip title={tooltip || ""} arrow placement="right">
      <ListItem id={id} button component={renderLink} onClick={onClick}>
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} />
      </ListItem>
    </Tooltip>
  );
}

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    '@global': {
      '*::-webkit-scrollbar': {
        width: '0.75em',
        height: '0.75em'
      },
      '*::-webkit-scrollbar-track': {
        backgroundColor: convertHexToRGBA(theme.palette.background.default, 0.5)
      },
      '*::-webkit-scrollbar-thumb': {
        backgroundColor: convertHexToRGBA(theme.palette.secondary.main, 0.5)
      },
      '*::-webkit-scrollbar-corner': {
        backgroundColor: theme.palette.background.paper
      }
    },
    root: {
      display: 'flex'
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 36,
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: theme.spacing(7) + 1,
      // [theme.breakpoints.up('sm')]: {
      //   width: theme.spacing(9) + 1,
      // },
    },
    toolbar: {
      // display: 'flex',
      // alignItems: 'center',
      // justifyContent: 'flex-end',
      // padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  }),
);

export default function MiniDrawer({ children }: SideDrawerProps) {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const settingsOpen = Boolean(anchorEl);
  const { enqueueSnackbar } = useSnackbar();
  const { currentProject, setCurrentProject, setProjects } = useProjects();
  const { name } = currentProject;
  const [isLoading, setIsLoading] = React.useState(true);
  const [renameProjectDialog, setRenameProjectDialog] = React.useState(false);
  const [newProjectDialog, setNewProjectDialog] = React.useState(false);
  const [openProjectDialog, setOpenProjectDialog] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const handleSave = () => {
    setProjects(projects => projects.map(project => {
        if (project.name === name) {
          return currentProject;
        } else {
          return project;
        }
      })
    );
    enqueueSnackbar('Project saved', { variant: 'success' })
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleSettingsMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setAnchorEl(null);
  };

  if (isLoading) return <Backdrop open={isLoading} />

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Grid container justify="space-between">
            <Typography variant="h6" noWrap>
              {name}
              <Tooltip title="Rename" arrow>
                <IconButton id="rename-project-button" onClick={() => setRenameProjectDialog(true)}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </Typography>
            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleSettingsMenu}
                color="inherit"
              >
                <SettingsIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={settingsOpen}
                onClose={handleSettingsClose}
              >
                <MenuItem>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={currentProject.showMediaTables}
                        onKeyPress={handleInputKeyPress}
                        onChange={(e, checked) => setCurrentProject(project => ({ ...project, showMediaTables: checked }))}
                        name="showMediaTables"
                      />
                    }
                    label="Show Media Tables"
                  />
                </MenuItem>
              </Menu>
            </div>
          </Grid>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItemLink id="homeLink" to="/" tooltip={open ? "" : "Current Project"} primary="Current Project" icon={<HomeIcon />} />
          <Tooltip title={open ? "" : "New Project"} arrow placement="right">
            <ListItem id="new-project-button" onClick={() => setNewProjectDialog(true)} button>
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>
              <ListItemText primary="New Project" />
            </ListItem>
          </Tooltip>
          <Tooltip title={open ? "" : "Save Project"} arrow placement="right">
            <ListItem id="save-project-button" onClick={handleSave} button>
              <ListItemIcon>
                <SaveIcon />
              </ListItemIcon>
              <ListItemText primary="Save Project" />
            </ListItem>
          </Tooltip>
          <Tooltip title={open ? "" : "Open Project"} arrow placement="right">
            <ListItem id="open-project-button" onClick={() => setOpenProjectDialog(true)} button>
              <ListItemIcon>
                <FolderIcon />
              </ListItemIcon>
              <ListItemText primary="Open Project" />
            </ListItem>
          </Tooltip>
        </List>
        <Divider />
        <ListItemLink id="aboutLink" to="/about" tooltip={open ? "" : "About Page"} primary="About" icon={<InfoIcon />} />
        <ListItemLink id="hotkeysLink" to="/hotkeys" tooltip={open ? "" : "Hotkeys Page"} primary="Hotkeys" icon={<KeyboardIcon />} />
        <ListItemLink id="helpLink" to="/help" tooltip={open ? "" : "Help Page"} primary="Help" icon={<HelpIcon />} />
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {children}
        <RenameProjectDialog open={renameProjectDialog} setOpen={setRenameProjectDialog} />
        <NewProjectDialog open={newProjectDialog} setOpen={setNewProjectDialog} />
        <OpenProjectDialog open={openProjectDialog} setOpen={setOpenProjectDialog} />
      </main>
    </div>
  );
}
