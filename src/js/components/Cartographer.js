// @flow

import React from 'react';

import CartographerActions from '../actions/CartographerActions';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import {withStyles} from '@material-ui/core/styles';
import withRoot from '../../withRoot';

const styles = (theme: Object) => ({
  root: {
    flexGrow: 1
  },
  banner: {
    backgroundColor: theme.palette.primary.light
  },
  buttonContainer: {
    padding: theme.spacing.unit * 2,
  }
});

type Props = {
  classes: Object,
  rosClient: Object
};

class Cartographer extends React.Component<Props> {
  componentWillMount() {
    if (typeof this.props.rosClient !== 'undefined') {
      // CartographerActions.connect(this.props.rosClient);
      CartographerActions.connect(this.props.rosClient);
    }
  }

  componentWillUnmount() {
    CartographerActions.disconnect();
  }

  handleSaveStateClick = (event: SyntheticEvent<HTMLButtonElement>) => {
    CartographerActions.saveState();
  };

  handleFinishTrajectory = (event: SyntheticEvent<HTMLButtonElement>) => {
    CartographerActions.finishTrajectory(0);
  };

  render() {
    const {classes} = this.props;

    return (
      <div className={classes.root}>
        <Paper>
          <Grid container direction="column" justify="flex-start">
            <Grid item>
              <Paper className={classes.banner}>
                <Typography align="center">Catographer</Typography>
              </Paper>
            </Grid>
            <Grid item>
              <Grid container className={classes.buttonContainer} justify="space-around" spacing={24}>
                <Grid item>
                  <Button variant="outlined" onClick={this.handleFinishTrajectory}>
                    Finish Trajectory 0
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={this.handleSaveStateClick}
                  >
                    Save State
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </div>
    );
  }
}

export default withRoot(withStyles(styles)(Cartographer));
