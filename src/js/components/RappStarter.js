// @flow
import React from 'react';

import RappStarterActions from '../actions/RappStarterActions';
import RappStarterStore from '../stores/RappStarterStore';

import Paper from '@material-ui/core/Paper';

import PowerIcon from '@material-ui/icons/PowerSettingsNew';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import {withStyles} from '@material-ui/core/styles';
import withRoot from '../../withRoot';

const styles = (theme: Object) => ({
  root: {
    flexGrow: 1
  },
  icon: {
    margin: theme.spacing.unit * 2
  }
});

class RappStarter extends React.PureComponent {
  constructor(...args) {
    super(...args);

    this.state = {store: RappStarterStore.getState()};
  }

  componentWillMount() {
    if (typeof this.props.rosClient !== 'undefined') {
      RappStarterActions.connect(this.props.rosClient);
    }

    RappStarterStore.on('change', this.getStateFromStore);
  }

  componentWillUnmount() {
    RappStarterActions.disconnect();

    RappStarterStore.removeListener('change', this.getStateFromStore);
  }

  getStateFromStore = () => {
    this.setState({store: RappStarterStore.getState()});
  };

  getRunningRapp = () => {
    const rappList = this.state.store.get('availableRapps');

    let runningRapp = null;
    rappList.forEach(rapp => {
      if (rapp.get('status') === 'Running') {
        runningRapp = rapp.get('name');
      }
    });

    return runningRapp;
  };

  handleRappClick = (rappName, clickEvent) => {
    const runningRapp = this.getRunningRapp();

    if (rappName === runningRapp) {
      RappStarterActions.stopRapp();
    } else {
      RappStarterActions.startRapp(rappName);
    }
  };

  handleLoadingDialogClose = buttonClicked => {
    RappStarterActions.closeLoadingDialog();
  };

  render() {
    const {classes} = this.props;

    const state = this.state.store;
    const availableRapps = state.get('availableRapps');

    const rappList = [];

    availableRapps.forEach(rapp => {
      const name: string = rapp.get('name');
      const displayName: string = rapp.get('display_name');
      const status: string = rapp.get('status');

      let powerIcon;
      if (status === 'Running') {
        powerIcon = <PowerIcon color="secondary" />;
      } else {
        powerIcon = <PowerIcon />;
      }

      rappList.push(
        <ListItem key={name} onClick={this.handleRappClick.bind(this, name)}>
          <ListItemText primary={displayName} />
          {powerIcon}
        </ListItem>
      );
    });

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <List>{rappList}</List>
        </Paper>
      </div>
    );
  }
}

export default withRoot(withStyles(styles)(RappStarter));
