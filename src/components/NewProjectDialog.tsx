import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';

type Props = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  setName: React.Dispatch<React.SetStateAction<string>>
}

const NewProjectDialog = ({ open, setOpen, setName }: Props) => {
  const [projectName, setProjectName] = React.useState('');

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreate = () => {
    setName(projectName)
    setOpen(false);
  }

  return (
    <>
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
                onChange={(e) => setProjectName(e.target.value)}
                variant="filled"
                margin="dense"
                label="Project Name"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained">
            Cancel
          </Button>
          <Button onClick={handleCreate} variant="contained" color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default NewProjectDialog;