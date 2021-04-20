import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import { useProjects, projectDefaults } from '../common/Context';
import { useSnackbar } from 'notistack';

type Props = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const NewProjectDialog = ({ open, setOpen }: Props) => {
  const { projects, setProjects, setCurrentProject } = useProjects();
  const { enqueueSnackbar } = useSnackbar();
  const [projectName, setProjectName] = React.useState(projectDefaults.name);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    setProjectName(projectDefaults.name);
  }, [open]);

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

  const handleCreate = () => {
    const newProject = { ...projectDefaults };
    newProject.name = projectName;

    setOpen(false);
    setProjects(projects => projects.concat(newProject));
    setCurrentProject(newProject);
    enqueueSnackbar(`${projectName} created.`, { variant: 'info' });
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      handleCreate();
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="new-project-dialog">
      <DialogTitle id="new-project-dialog">New Project Options</DialogTitle>
      <DialogContent>
        <DialogContentText>
          
        </DialogContentText>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <TextField
              autoFocus
              value={projectName}
              onFocus={(e) => e.target.select()}
              onChange={(e) => setProjectName(e.target.value)}
              onKeyPress={handleKeyPress}
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
        <Button onClick={handleCreate} variant="contained" color="primary" disabled={error}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default NewProjectDialog;