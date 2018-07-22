// @flow

import React from 'react';

import WorldStateActions from '../actions/WorldStateActions';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

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
    padding: theme.spacing.unit * 2
  }
});

type Props = {
  classes: Object,
  rosClient: Object
};

type State = {
  addCurrentLocationDialogOpen: boolean,
  currentLocationName: string
};

class WorldState extends React.Component<Props, State> {
  state = {
    addCurrentLocationDialogOpen: false,
    currentLocationName: ''
  };

  componentWillMount() {
    if (typeof this.props.rosClient !== 'undefined') {
      WorldStateActions.connect(this.props.rosClient);
    }
  }

  componentWillUnmount() {
    WorldStateActions.disconnect();
  }

  handleClickOpenAddCurrentLocationDialog = (event): void => {
    this.setState({addCurrentLocationDialogOpen: true});
  };

  handleCloseAddCurrentLocationDialog = (event): void => {
    this.setState({addCurrentLocationDialogOpen: false});
  };

  handleAddCurrentLocation = (event: SyntheticEvent<HTMLButtonElement>) => {
    WorldStateActions.addCurrentLocation(this.state.currentLocationName);
    this.setState({addCurrentLocationDialogOpen: false});
  };

  handleSaveLocations = (event: SyntheticEvent<HTMLButtonElement>) => {
    WorldStateActions.saveLocations();
  };

  handleLoadLocations = (event: SyntheticEvent<HTMLButtonElement>) => {
    WorldStateActions.loadLocations();
  };

  handleClearLocations = (event: SyntheticEvent<HTMLButtonElement>) => {
    WorldStateActions.clearLocations();
  };

  handleAddCurrentLocationNameChange = event => {
    this.setState({currentLocationName: event.target.value});
  };

  render() {
    const {classes} = this.props;

    return (
      <div className={classes.root}>
        <Paper>
          <Grid container direction="column" justify="flex-start">
            <Grid item>
              <Paper className={classes.banner}>
                <Typography align="center">World State</Typography>
              </Paper>
            </Grid>
            <Grid item>
              <Grid
                container
                className={classes.buttonContainer}
                justify="space-around"
                spacing={24}
              >
                <Grid item>
                  <Button onClick={this.handleSaveLocations}>
                    Save Locations
                  </Button>
                </Grid>
                <Grid item>
                  <Button onClick={this.handleLoadLocations}>
                    Load Locations
                  </Button>
                </Grid>
                <Grid item>
                  <Button color="secondary" onClick={this.handleClearLocations}>
                    Clear Locations
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={this.handleClickOpenAddCurrentLocationDialog}
                  >
                    Add Current Location
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
        <Dialog
          open={this.state.addCurrentLocationDialogOpen}
          onClose={this.handleCloseAddCurrentLocationDialog}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Add current location</DialogTitle>
          <DialogContent>
            <DialogContentText>Set a name for the location</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="name"
              onChange={this.handleAddCurrentLocationNameChange}
              fullWidth
              onKeyPress={event => {
                if (event.key === 'Enter') {
                  if (this.state.currentLocationName !== '') {
                    this.handleAddCurrentLocation();
                  }
                  event.preventDefault();
                }
              }}
            />
          </DialogContent>

          <DialogActions>
            <Button
              onClick={this.handleCloseAddCurrentLocationDialog}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              onClick={this.handleAddCurrentLocation}
              disabled={this.state.currentLocationName === ''}
              color="primary"
            >
              Set
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withRoot(withStyles(styles)(WorldState));
