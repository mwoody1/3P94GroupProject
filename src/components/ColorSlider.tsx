import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';

type ColorSliderProps = {
  title: string
  value: number
  setValue: React.Dispatch<React.SetStateAction<number>>
  min: number
  max: number
}

const useStyles = makeStyles({
  root: {
    width: 250,
  },
  input: {
    width: 75,
  },
});

const ColorSlider = ({ title, value, setValue, min, max }: ColorSliderProps) => {
  const classes = useStyles();

  const handleSliderChange = (event: any, newValue: number | number[]) => {
    if (Array.isArray(newValue)) return;
    setValue(newValue);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!Number.isNaN(event.target.value)) {
      setValue(Number(event.target.value));
    }
  };

  const handleBlur = () => {
    if (value < min) {
      setValue(min);
    } else if (value > max) {
      setValue(max);
    }
  };

  return (
    <div className={classes.root}>
      <Typography id="input-slider" gutterBottom>
        {title}
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs>
          <Slider
            value={typeof value === 'number' ? value : 0}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
            min={min}
            max={max}
          />
        </Grid>
        <Grid item>
          <Input
            className={classes.input}
            value={value}
            margin="dense"
            onChange={handleInputChange}
            onBlur={handleBlur}
            endAdornment={<InputAdornment position="end">%</InputAdornment>}
            inputProps={{
              step: 0,
              min: min,
              max: max,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default ColorSlider;