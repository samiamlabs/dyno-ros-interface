import React from 'react';

import CapabilitiesActions from '../actions/CapabilitiesActions';
import CapabilitiesStore from '../stores/CapabilitiesStore';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import Switch from '@material-ui/core/Switch';

import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import {withStyles} from '@material-ui/core/styles';
import withRoot from '../../withRoot';

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  banner: {
    backgroundColor: theme.palette.primary.light
  },
  capabilities: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary
  }
});

class Capabilities extends React.Component {
  constructor(...args) {
    super(...args);

    this.state = {
      store: CapabilitiesStore.getState()
    };
  }

  componentWillMount() {
    CapabilitiesStore.on('change', this.getAll);

    CapabilitiesActions.connect(this.props.rosClient);
  }

  componentWillUnmount() {
    CapabilitiesStore.removeListener('change', this.getAll);

    CapabilitiesActions.dispose();
  }

  getAll = () => {
    this.setState({
      store: CapabilitiesStore.getState()
    });
  };

  handleToggle = (provider, event, isInputChecked) => {
    const available = this.state.store.get('available').toJS();

    available.forEach(capability => {
      if (capability.provider === provider) {
        if (isInputChecked) {
          CapabilitiesActions.startCapability(
            capability.interface_name,
            provider
          );
        } else {
          CapabilitiesActions.stopCapability(capability.interface_name);
        }
        return;
      }
    });
  };

  render() {
    const {classes} = this.props;
    const state = this.state.store;

    const running_providers = state
      .get('running')
      .map(capability => {
        return capability.getIn(['capability', 'provider']);
      })
      .toJS();
    const available_capabilities = state.get('available').toJS();

    return (
      <div className={classes.root}>
        <Paper>
          <Grid container direction="column" justify="flex-start">
            <Grid item>
              <Paper className={classes.banner}>
                <Typography align="center">Capabilities</Typography>
              </Paper>
            </Grid>
            <Grid item className={classes.capabilities}>
              <CapabilityTable
                available={available_capabilities}
                running={running_providers}
                handleToggle={this.handleToggle}
              />
            </Grid>
          </Grid>
        </Paper>
      </div>
    );
  }
}

class CapabilityTable extends React.Component {
  render() {
    const rows = [];
    let lastInterfaceName = null;

    if (typeof this.props.available.length === 'undefined') {
      return <h2>No capabilities found!</h2>;
    }

    const availableSorted = this.props.available.sort((a, b) => {
      if (a.interface_name < b.interface_name) {
        return -1;
      }
      if (a.interface_name > b.interface_name) {
        return 1;
      }

      // Interface name must be equal
      if (a.provider < b.provider) {
        return -1;
      }
      if (a.provider > b.provider) {
        return 1;
      }

      // Providers must be equal as well
      return 0;
    });

    let provider_group = [];

    availableSorted.forEach(capability => {
      if (capability.interface_name !== lastInterfaceName) {
        rows.push(
          <FormGroup key={lastInterfaceName + '_group'}>
            {provider_group}
          </FormGroup>
        );
        rows.push(
          <CapabilityInterface
            key={capability.interface_name}
            name={capability.interface_name}
            show_pkg={false}
          />
        );

        provider_group = [];
      }

      const running = this.props.running.includes(capability.provider);

      provider_group.push(
        <CapabilityProvider
          key={capability.provider}
          name={capability.provider}
          running={running}
          handleToggle={this.props.handleToggle}
          show_pkg={false}
        />
      );

      lastInterfaceName = capability.interface_name;
    });

    rows.push(
      <FormGroup key={lastInterfaceName + '_group'}>{provider_group}</FormGroup>
    );

    return <FormControl component="fieldset">{rows}</FormControl>;
  }
}

class CapabilityInterface extends React.Component {
  render() {
    let name = this.props.name;
    if (!this.props.show_pkg) {
      const nameArray = name.split('/');
      name = nameArray[nameArray.length - 1];
    }
    return <FormLabel component="legend">{name}</FormLabel>;
  }
}

class CapabilityProvider extends React.Component {
  render() {
    let label = this.props.name;
    if (!this.props.show_pkg) {
      const nameArray = label.split('/');
      label = nameArray[nameArray.length - 1];
    }

    label = label.replace(/_/g, ' ');

    return (
      <FormControlLabel
        control={
          <Switch
            color="primary"
            checked={this.props.running}
            onChange={this.props.handleToggle.bind(this, this.props.name)}
          />
        }
        label={label}
      />
    );
  }
}

export default withRoot(withStyles(styles)(Capabilities));
