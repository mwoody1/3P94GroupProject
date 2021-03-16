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
// import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ImageIcon from '@material-ui/icons/Image';
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import Backdrop from '../common/Backdrop';
import { convertHexToRGBA, fileCallbackToPromise } from '../common';
import ListSubheader from '@material-ui/core/ListSubheader';
import { AudioFileMeta, ImageFileMeta, useFiles, VideoFileMeta } from '../common/Context';


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
    // appBar: {
    //   [theme.breakpoints.up('md')]: {
    //     width: `calc(100% - ${drawerWidth}px)`,
    //     marginLeft: drawerWidth,
    //   },
    // },
    // menuButton: {
    //   marginRight: theme.spacing(2),
    //   [theme.breakpoints.up('md')]: {
    //     display: 'none',
    //   },
    // },
    // drawer: {
    //   [theme.breakpoints.up('md')]: {
    //     width: drawerWidth,
    //     flexShrink: 0,
    //   },
    // },
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
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      // backgroundColor: theme.palette.background.default,
      padding: theme.spacing(3),
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
    input: {
      display: 'none',
    },
  }),
);

type SideDrawerProps = {
  children: ReactNode
}

// interface ListItemLinkProps {
//   icon?: React.ReactElement;
//   primary: string;
//   to: string;
//   onClick: () => void;
// }

// function ListItemLink(props: ListItemLinkProps) {
//   const { icon, primary, to, onClick } = props;

//   const renderLink = React.useMemo(
//     () =>
//       React.forwardRef<any, Omit<RouterLinkProps, 'to'>>((itemProps, ref) => (
//         <RouterLink to={to} ref={ref} {...itemProps} />
//       )),
//     [to],
//   );

//   return (
//     <li>
//       <ListItem button component={renderLink} onClick={onClick}>
//         {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
//         <ListItemText primary={primary} />
//       </ListItem>
//     </li>
//   );
// }

const SideDrawer = ({ children }: SideDrawerProps) => {
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const { setAudioFiles, setImageFiles, setVideoFiles } = useFiles();

  React.useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    let files = event.target.files;

    if (!files) return;
    
    let newVideoFiles = await Promise.all(Array.from(files).map(async file => {
      let src = URL.createObjectURL(file);
      let fileMeta: VideoFileMeta;
      let video = document.createElement('video');
      
      video.src = src;
      await fileCallbackToPromise(video);
      fileMeta = { name: file.name, size: file.size, type: file.type, src, width: video.videoWidth, height: video.videoHeight, length: video.duration.toString()};
      
      return fileMeta;
    }));

    setVideoFiles(videoFiles => videoFiles.concat(newVideoFiles));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    let files = event.target.files;

    if (!files) return;
    
    let newImageFiles = await Promise.all(Array.from(files).map(async file => {
      let src = URL.createObjectURL(file);
      let fileMeta: ImageFileMeta;
      let image = document.createElement('img');

      image.src = src;
      await fileCallbackToPromise(image);
         
      fileMeta = { name: file.name, size: file.size, type: file.type, src, width: image.naturalWidth, height: image.naturalHeight};

      return fileMeta;
    }));

    setImageFiles(imageFiles => imageFiles.concat(newImageFiles));
  };

  const handleAudioUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    let files = event.target.files;

    if (!files) return;
    
    let newAudioFiles = await Promise.all(Array.from(files).map(async file => {
      let src = URL.createObjectURL(file);
      let fileMeta: AudioFileMeta;
      let audio = document.createElement('audio');

      audio.src = src;
      await fileCallbackToPromise(audio);
     
      fileMeta = { name: file.name, size: file.size, type: file.type, src, length: audio.duration.toString()};
      
      return fileMeta;
    }));

    setAudioFiles(audioFiles => audioFiles.concat(newAudioFiles));
  };

  const drawer = (
    <>
      <div className={classes.toolbar} />
      <Divider />
      <List
        subheader={<ListSubheader component="div" id="nested-list-subheader">
          Upload Files
        </ListSubheader>}
      >
        {/* <ListItemLink to="/" primary="Home" icon={<HomeIcon />} onClick={() => setMobileOpen(false)} />
        <ListItemLink to="/users" primary="Users" icon={<PeopleIcon />} onClick={() => setMobileOpen(false)} />
        <ListItemLink to="/dealers" primary="Dealers" icon={<BusinessIcon />} onClick={() => setMobileOpen(false)} />
        <ListItemLink to="/plans" primary="Plans" icon={<ViewIcon />} onClick={() => setMobileOpen(false)} />
        <ListItemLink to="/vehicle-makes" primary="Vehicle Makes" icon={<DirectionsCarIcon />} onClick={() => setMobileOpen(false)} /> */}
        <input
          accept="audio/*"
          className={classes.input}
          id="audio-import"
          multiple
          type="file"
          onChange={(e) => handleAudioUpload(e)}
        />
        <label htmlFor="audio-import">
          <ListItem button>
            <ListItemIcon>
              <VideoLibraryIcon />
            </ListItemIcon>
            <ListItemText primary="Audio" />
          </ListItem>
        </label>
        <input
          accept="image/*"
          className={classes.input}
          id="image-import"
          multiple
          type="file"
          onChange={(e) => handleImageUpload(e)}
        />
        <label htmlFor="image-import">
        <ListItem button>
          <ListItemIcon>
            <ImageIcon />
          </ListItemIcon>
          <ListItemText primary="Images" />
        </ListItem>
        </label>
        <input
          accept="video/*"
          className={classes.input}
          id="video-import"
          multiple
          type="file"
          onChange={(e) => handleVideoUpload(e)}
        />
        <label htmlFor="video-import">
          <ListItem button>
            <ListItemIcon>
              <VideoLibraryIcon />
            </ListItemIcon>
            <ListItemText primary="Videos" />
          </ListItem>
        </label>
      </List>
      <Divider />
      {/* <List>
        <ListItemLink to="/" primary="Log Out" icon={<ExitIcon />} onClick={() => null} />
      </List> */}
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
            Video Editor - Stage 2
          </Typography>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* <Hidden mdUp> */}
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
        {/* <Hidden smDown> */}
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
      </main>
    </div>
  );
}

export default SideDrawer;
