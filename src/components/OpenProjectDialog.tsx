import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { useProjects } from '../common/Context';
import { useSnackbar } from 'notistack';

type Props = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const OpenProjectDialog = ({ open, setOpen }: Props) => {
  const { projects, setCurrentProject } = useProjects();
  const { enqueueSnackbar } = useSnackbar();
  const [projectName, setProjectName] = React.useState('');

  React.useEffect(() => {
    setProjectName('');
  }, [open]);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setProjectName(event.target.value as string);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    let projectToOpen = projects.find(project => project.name === projectName);
    if (projectToOpen) {
      setCurrentProject(projectToOpen);
      setOpen(false);
      enqueueSnackbar(`${projectName} opened.`, { variant: 'info' });
    } else {
      console.log('could not find project');
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="open-project-dialog">
      <DialogTitle id="open-project-dialog">Open Project</DialogTitle>
      <DialogContent>
        <DialogContentText>
          
        </DialogContentText>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <FormControl style={{ width: 200 }}>
              <InputLabel id="select-project">Project</InputLabel>
              <Select
                value={projectName}
                onChange={handleChange}
                variant="filled"
                margin="dense"
                id="select-project"
                label="Project"
              >
                {projects.map((project, index) => <MenuItem key={index} value={project.name}>{project.name}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained">
          Cancel
        </Button>
        <Button onClick={handleOpen} variant="contained" color="primary">
          Open
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default OpenProjectDialog;