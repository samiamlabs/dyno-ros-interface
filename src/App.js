// @flow

import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import withRoot from './withRoot';

import AppStore from './js/stores/AppStore';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Grid from '@material-ui/core/Grid';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import RosClient from 'roslib-client';
import Cookies from 'universal-cookie';

import RappStarter from './js/components/RappStarter.js';
import Capabilities from './js/components/Capabilities.js';
import Cartographer from './js/components/Cartographer';
import WorldState from './js/components/WorldState';
import RouteScheduler from './js/components/RouteScheduler';
import DroneParcelDelivery from './js/components/DroneParcelDelivery';

const styles = (theme: Object) => ({
  root: {
    flexGrow: 1
  },
  flex: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  sectionContainer: {
    padding: theme.spacing.unit * 2
  }
});

type ProvidedProps = {
  classes: Object
};

type Props = {
  classes: Object
};

type State = {
  rosStatus: string,
  rosClient: Object
};

class App extends React.Component<ProvidedProps & Props, State> {
  state = {
    anchorEl: null,
    hostnameDialogOpen: false,
    hostnameText: 'localhost',
    portText: '9090',
    rosConnectionStatus: 'disconnected',
    cookies: new Cookies(),
    store: AppStore.getState()
  };

  componentWillMount() {
    let hostname = this.state.cookies.get('hostname');
    if (typeof hostname === 'undefined') {
      hostname = 'localhost';
    }

    let port = this.state.cookies.get('port');
    if (typeof port === 'undefined') {
      port = '9090';
    }

    this.setState({hostnameText: hostname, portText: port});
    this.setRosClient(hostname, port);

    AppStore.on('change', this.getAll);
  }

  componentWillUnmount() {
    AppStore.removeListener('change', this.getAll);
  }

  getAll = () => {
    this.setState({
      store: AppStore.getState()
    });
  };

  setRosClient = (hostname: string, port: string) => {
    const rosUrl = 'ws://' + hostname + ':' + port;

    let rosClient = new RosClient({
      url: rosUrl
    });

    rosClient.on('connected', () => {
      console.log('Connected to websocket server.');
      this.setState({
        rosConnectionStatus: 'connected'
      });
    });

    rosClient.on('disconnected', () => {
      console.log('Disconnected from websocket server.');
      this.setState({
        rosConnectionStatus: 'disconnected'
      });
    });

    this.setState({
      rosClient
    });
  };

  handleMenu = event => {
    this.setState({anchorEl: event.currentTarget});
  };

  handleCloseMenu = () => {
    this.setState({anchorEl: null});
  };

  handleClickOpenHostnameDialog = () => {
    this.setState({anchorEl: null, hostnameDialogOpen: true});
  };

  handleCloseHostnameDialog = () => {
    this.setState({hostnameDialogOpen: false});
  };

  handleUpdateHostnameText = event => {
    this.setState({hostnameText: event.target.value});
  };

  handleUpdatePortText = event => {
    this.setState({portText: event.target.value});
  };

  handleSetHostname = event => {
    this.setRosClient(this.state.hostnameText, this.state.portText);
    this.handleCloseHostnameDialog();
    this.setState({rosConnectionStatus: 'disconnected'});
    this.state.cookies.set('hostname', this.state.hostnameText, {path: '/'});
    this.state.cookies.set('port', this.state.portText, {path: '/'});
  };

  getRunningRapp = () => {
    const rappList = this.state.store.get('available_rapps');

    let runningRapp = null;
    rappList.forEach(rapp => {
      if (rapp.get('status') === 'Running') {
        runningRapp = rapp.get('name');
      }
    });

    return runningRapp;
  };

  render() {
    const {classes} = this.props;
    const {anchorEl} = this.state;
    const open = Boolean(anchorEl);
    const {store} = this.state;

    const running_capabilities = store
      .get('running_capabilities')
      .toJS()
      .map(capability => {
        return capability.capability.provider;
      });

    let show_cartographer = false;
    let show_world_state = false;

    running_capabilities.forEach(provider => {
      if (provider.startsWith('dyno_capabilities/cartographer')) {
        show_cartographer = true;
      }
      if (provider === 'dyno_capabilities/world_state') {
        show_world_state = true;
      }
    });

    const show_route_scheduler = this.getRunningRapp() === "dyno_common_rapps/route_scheduler";

    // Dev
    show_world_state = true

    return (
      <div className={this.props.classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Menu"
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="title"
              color="inherit"
              className={classes.flex}
            >
              {this.state.rosConnectionStatus === 'connected'
                ? 'Dyno Control'
                : 'Disconnected'}
            </Typography>
            <div>
              <IconButton
                aria-owns={open ? 'menu-appbar' : null}
                aria-haspopup="true"
                onClick={this.handleMenu}
                color="inherit"
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                open={open}
                onClose={this.handleCloseMenu}
              >
                <MenuItem onClick={this.handleClickOpenHostnameDialog}>
                  Change hostname
                </MenuItem>
              </Menu>
            </div>
          </Toolbar>
        </AppBar>
        <Dialog
          open={this.state.hostnameDialogOpen}
          onClose={this.handleCloseHostnameDialog}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Change ROS hostname</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Set hostname and port for the websocket on your ROS system.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="hostname"
              value={this.state.hostnameText}
              onChange={this.handleUpdateHostnameText}
              fullWidth
            />
            <TextField
              autoFocus
              margin="dense"
              label="port"
              value={this.state.portText}
              onChange={this.handleUpdatePortText}
              fullWidth
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleCloseHostnameDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleSetHostname} color="primary">
              Set
            </Button>
          </DialogActions>
        </Dialog>
        {this.state.rosConnectionStatus === 'connected' && (
          <Grid
            className={classes.sectionContainer}
            container
            direction="column"
            alignItems="stretch"
            spacing={16}
          >
            <Grid item>
              <RappStarter rosClient={this.state.rosClient} />
            </Grid>
            <Grid item>
              <Capabilities rosClient={this.state.rosClient} />
            </Grid>
            {show_cartographer && (
              <Grid item>
                <Cartographer rosClient={this.state.rosClient} />
              </Grid>
            )}
            {show_world_state && (
              <Grid item>
                <WorldState rosClient={this.state.rosClient} />
              </Grid>
            )}
            {show_route_scheduler && (
              <Grid item>
                <RouteScheduler rosClient={this.state.rosClient} />
              </Grid>
            )}
              <Grid item>
                <DroneParcelDelivery rosClient={this.state.rosClient} />
              </Grid>
          </Grid>
        )}
      </div>
    );
  }
}

export default withRoot(withStyles(styles)(App));
