import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import { useProjects } from '../common/Context';
import { useSnackbar } from 'notistack';

type Props = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const RenameProjectDialog = ({ open, setOpen }: Props) => {
  const { projects, setProjects, currentProject, setCurrentProject } = useProjects();
  const { enqueueSnackbar } = useSnackbar();
  const [projectName, setProjectName] = React.useState(currentProject.name);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    if (projects.find(project => project.name === projectName)) {
      setError(true);
    } else {
      setError(false);
    }
  }, [projects, projectName]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleRename = () => {
    setOpen(false);
    setProjects(projects.map(project => {
      if (project.name === currentProject.name) {
        return { ...currentProject, name: projectName };
      } else {
        return project;
      }
    }));
    setCurrentProject({ ...currentProject, name: projectName});
    enqueueSnackbar(`${currentProject.name} renamed to ${projectName}.`, { variant: 'info' });
  }

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="project-rename-dialog">
      <DialogTitle id="project-rename-dialog">Rename Project</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Note: This process will also save the current project
        </DialogContentText>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <TextField
              autoFocus
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              variant="filled"
              margin="dense"
              label="Project Name"
              error={error}
              helperText={error && "Project name already exists"}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained">
          Cancel
        </Button>
        <Button onClick={handleRename} variant="contained" color="primary" disabled={error}>
          Rename
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default RenameProjectDialog;