// @flow

import React from 'react';

import DroneParcelDeliveryActions from '../actions/DroneParcelDeliveryActions';
import DroneParcelDeliveryStore from '../stores/DroneParcelDeliveryStore';

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

class DroneParcelDelivery extends React.Component<Props, State> {
  state = {
    store: DroneParcelDeliveryStore.getState()
  };

  componentWillMount() {
    if (typeof this.props.rosClient !== 'undefined') {
      DroneParcelDeliveryActions.connect(this.props.rosClient);
    }

    DroneParcelDeliveryStore.on('change', this.getState);
  }

  componentWillUnmount() {
    DroneParcelDeliveryActions.disconnect();

    DroneParcelDeliveryStore.removeListener('change', this.getState);
  }

  getState = () => {
    this.setState({
      store: DroneParcelDeliveryStore.getState()
    });
  };

  handleStartClick = (event: SyntheticEvent<HTMLButtonElement>) => {
    DroneParcelDeliveryActions.start();
  };

  handleStopClick = (event: SyntheticEvent<HTMLButtonElement>) => {
    DroneParcelDeliveryActions.stop();
  };

  handleObjectChange = event => {
    DroneParcelDeliveryActions.setSelectedObject(event.target.value);
  };

  handleLocationChange = event => {
    DroneParcelDeliveryActions.setSelectedLocation(event.target.value);
  };

  handleAddDeliveryClick = (event: SyntheticEvent<HTMLButtonElement>) => {
    const object_name = this.state.store.get('selectedObject')
    const location_name = this.state.store.get('selectedLocation')
    DroneParcelDeliveryActions.addDelivery(object_name, location_name);
  };

  handleClearLocationClick = (event: SyntheticEvent<HTMLButtonElement>) => {
    DroneParcelDeliveryActions.clear();
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
                <Typography align="center">Drone Parcel Delivery</Typography>
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
                      <Typography align="center">Delivery Queue</Typography>
                    </Paper>
                    <List dense>{generateQueueListItems(store)}</List>
                  </Paper>
                </Grid>
                <Grid item>
                  <Grid container direction="row" justify="center" spacing={8}>
                    <Grid item>
                      <Typography variant='headline'>Move object</Typography>
                    </Grid>
                    <Grid item>
                      <Select
                        value={store.get('selectedObject')}
                        onChange={this.handleObjectChange}
                      >
                        {generateObjectMenuItems(store)}
                      </Select>
                    </Grid>
                    <Grid item>
                      <Typography variant='headline'>to location</Typography>
                    </Grid>
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
                        onClick={this.handleAddDeliveryClick}
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

function generateObjectMenuItems(store) {
  let objects = [];
  store.get('objects').forEach(object => {
    const name = object.get('name');
    objects.push(
      <MenuItem key={name} value={name}>
        {name}
      </MenuItem>
    );
  });

  return objects;
}

function generateQueueListItems(store) {
  let delivery_queue = [];
  let counter = 0;

  if (store.get('delivery_queue').toJS().length === 0) {
    delivery_queue.push(
      <ListItem key={counter}>
        <ListItemText
          align="center"
          primary="Queue is empty!"
          variant="caption"
        />
      </ListItem>
    );

    return delivery_queue;
  }

  store.get('delivery_queue').forEach(delivery => {
    const location_name = delivery.get('location_name');
    const object_name = delivery.get('object_name');

    const delivery_text = object_name + " >> " + location_name;


    delivery_queue.push(
      <ListItem key={counter}>
        <ListItemText align="center" primaryTypographyProps={{variant: "title"}} primary={delivery_text} />
      </ListItem>
    );

    counter++;
  });

  return delivery_queue;
}

export default withRoot(withStyles(styles)(DroneParcelDelivery));
