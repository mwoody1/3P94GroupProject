import React, { ReactNode } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AddIcon from '@material-ui/icons/Add';
import FolderIcon from '@material-ui/icons/Folder';
import Backdrop from '../common/Backdrop';
import { convertHexToRGBA } from '../common';
import ListSubheader from '@material-ui/core/ListSubheader';
import HomeIcon from '@material-ui/icons/Home';
import KeyboardIcon from '@material-ui/icons/Keyboard';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import HelpIcon from '@material-ui/icons/Help';
import InfoIcon from '@material-ui/icons/Info';
import { useProjects } from '../common/Context';
import NewProjectDialog from './NewProjectDialog';
import OpenProjectDialog from './OpenProjectDialog';
import Tooltip from '@material-ui/core/Tooltip';
import RenameProjectDialog from './RenameProjectDialog';
import { useSnackbar } from 'notistack';


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
      display: 'flex',
    },
    appBar: {
      [theme.breakpoints.up('lg')]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('lg')]: {
        display: 'none',
      },
    },
    drawer: {
      [theme.breakpoints.up('lg')]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    drawerPaper: {
      width: drawerWidth,
    },
    title: {
      flexGrow: 1,
    },
    rename: {
      backgroundColor: theme.palette.background.default
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  }),
);

type SideDrawerProps = {
  children: ReactNode
}

interface ListItemLinkProps {
  id?: string
  icon?: React.ReactElement;
  primary: string;
  to: string;
  onClick: () => void;
}

function ListItemLink(props: ListItemLinkProps) {
  const { id, icon, primary, to, onClick } = props;

  const renderLink = React.useMemo(
    () =>
      React.forwardRef<any, Omit<RouterLinkProps, 'to'>>((itemProps, ref) => (
        <RouterLink to={to} ref={ref} {...itemProps} />
      )),
    [to],
  );

  return (
    <ListItem id={id} button component={renderLink} onClick={onClick}>
      {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
      <ListItemText primary={primary} />
    </ListItem>
  );
}

const SideDrawer = ({ children }: SideDrawerProps) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { currentProject, setProjects } = useProjects();
  const { name } = currentProject;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [renameProjectDialog, setRenameProjectDialog] = React.useState(false);
  const [newProjectDialog, setNewProjectDialog] = React.useState(false);
  const [openProjectDialog, setOpenProjectDialog] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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
  }

  const drawer = (
    <>
      <div className={classes.toolbar} />
      <Divider />
      <List
        subheader={<ListSubheader component="div" id="nested-list-subheader">
          Projects
        </ListSubheader>}
      >
        <ListItemLink id="homeLink" to="/" primary="Current" icon={<HomeIcon />} onClick={() => setMobileOpen(false)} />
        <ListItem id="new-project-button" onClick={() => setNewProjectDialog(true)} button>
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary="New" />
        </ListItem>
        <ListItem id="save-project-button" onClick={handleSave} button>
          <ListItemIcon>
            <SaveIcon />
          </ListItemIcon>
          <ListItemText primary="Save" />
        </ListItem>
        <ListItem id="open-project-button" onClick={() => setOpenProjectDialog(true)} button>
          <ListItemIcon>
            <FolderIcon />
          </ListItemIcon>
          <ListItemText primary="Open" />
        </ListItem>
      </List>
      <Divider />
      <ListItemLink id="aboutLink" to="/about" primary="About" icon={<InfoIcon />} onClick={() => setMobileOpen(false)} />
      <ListItemLink id="hotkeysLink" to="/hotkeys" primary="Hotkeys" icon={<KeyboardIcon />} onClick={() => setMobileOpen(false)} />
      <ListItemLink id="helpLink" to="/help" primary="Help" icon={<HelpIcon />} onClick={() => setMobileOpen(false)} />
    </>
  );

  if (isLoading) return <Backdrop open={isLoading} />
  
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap className={classes.title}>
            {name}
            <Tooltip title="Rename" arrow>
              <IconButton id="rename-project-button" onClick={() => setRenameProjectDialog(true)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
          </Typography>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        <Hidden lgUp>
          <Drawer
            variant="temporary"
            anchor='left'
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden mdDown>
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
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

export default SideDrawer;
