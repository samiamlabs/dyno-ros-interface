// @flow

import React from 'react';

import RouteSchedulerActions from '../actions/RouteSchedulerActions';
import RouteSchedulerStore from '../stores/RouteSchedulerStore';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import {withStyles} from '@material-ui/core/styles';
import withRoot from '../../withRoot';

const styles = (theme: Object) => ({
  root: {
    flexGrow: 1
  },
  banner: {
    backgroundColor: theme.palette.primary.light
  },
  queueContainer: {
    padding: theme.spacing.unit * 2
  },
  queueBanner: {
    backgroundColor: theme.palette.divider
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
  store: Object
};

class RouteScheduler extends React.Component<Props, State> {
  state = {
    store: RouteSchedulerStore.getState()
  };

  componentWillMount() {
    if (typeof this.props.rosClient !== 'undefined') {
      RouteSchedulerActions.connect(this.props.rosClient);
    }

    RouteSchedulerStore.on('change', this.getState);
  }

  componentWillUnmount() {
    RouteSchedulerActions.disconnect();

    RouteSchedulerStore.removeListener('change', this.getState);
  }

  getState = () => {
    this.setState({
      store: RouteSchedulerStore.getState()
    });
  };

  handleStartClick = (event: SyntheticEvent<HTMLButtonElement>) => {
    RouteSchedulerActions.start();
  };

  handleStopClick = (event: SyntheticEvent<HTMLButtonElement>) => {
    RouteSchedulerActions.stop();
  };

  handleLocationChange = event => {
    RouteSchedulerActions.setSelectedLocation(event.target.value);
  };

  handleAddLocationClick = (event: SyntheticEvent<HTMLButtonElement>) => {
    RouteSchedulerActions.addLocation(this.state.store.get('selectedLocation'));
  };

  handleClearLocationClick = (event: SyntheticEvent<HTMLButtonElement>) => {
    RouteSchedulerActions.clear();
  };

  render() {
    const {classes} = this.props;
    const {store} = this.state;

    return (
      <div className={classes.root}>
        <Paper>
          <Grid container direction="column" justify="flex-start">
            <Grid item>
              <Paper className={classes.banner}>
                <Typography align="center">Route Scheduler</Typography>
              </Paper>
            </Grid>
            <Grid item>
              <Grid
                container
                className={classes.queueContainer}
                direction="column"
                spacing={8}
              >
                <Grid item>
                  <Paper>
                    <Paper className={classes.queueBanner}>
                      <Typography align="center">Status</Typography>
                    </Paper>
                    <Typography align="center" gutterBottom variant="subheading">
                      {store.get('report')}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid
                container
                className={classes.queueContainer}
                direction="column"
                spacing={24}
              >
                <Grid item>
                  <Paper>
                    <Paper className={classes.queueBanner}>
                      <Typography align="center">Waypoint Queue</Typography>
                    </Paper>
                    <List dense>{generateQueueListItems(store)}</List>
                  </Paper>
                </Grid>
                <Grid item>
                  <Grid container direction="row" justify="center" spacing={8}>
                    <Grid item>
                      <Select
                        value={store.get('selectedLocation')}
                        onChange={this.handleLocationChange}
                      >
                        {generateLocationMenuItems(store)}
                      </Select>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="raised"
                        color="primary"
                        size="small"
                        onClick={this.handleAddLocationClick}
                      >
                        +
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        color="secondary"
                        size="small"
                        onClick={this.handleClearLocationClick}
                      >
                        Clear
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid
                container
                className={classes.buttonContainer}
                justify="space-around"
                spacing={24}
              >
                <Grid item>
                  <Button
                    color="secondary"
                    variant="raised"
                    onClick={this.handleStopClick}
                  >
                    Stop
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="raised"
                    color="primary"
                    onClick={this.handleStartClick}
                  >
                    Start
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

function generateLocationMenuItems(store) {
  let locations = [];
  store.get('locations').forEach(location => {
    const name = location.get('name');
    locations.push(
      <MenuItem key={name} value={name}>
        {name}
      </MenuItem>
    );
  });

  return locations;
}

function generateQueueListItems(store) {
  let location_queue = [];
  let counter = 0;

  if (store.get('location_queue').toJS().length === 0) {
    location_queue.push(
      <ListItem key={counter}>
        <ListItemText
          align="center"
          primary="Queue is empty!"
          variant="caption"
        />
      </ListItem>
    );

    return location_queue;
  }

  store.get('location_queue').forEach(location => {
    const name = location.get('name');
    location_queue.push(
      <ListItem key={counter}>
        <ListItemText align="center" primary={name} />
      </ListItem>
    );

    counter++;
  });

  return location_queue;
}

export default withRoot(withStyles(styles)(RouteScheduler));
