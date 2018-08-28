import React from 'react';

import NavigatorActions from '../actions/NavigatorActions';
import NavigatorStore from '../stores/NavigatorStore';

import NavigatorGame from '../navigator/NavigatorGame';

import Paper from '@material-ui/core/Paper';
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
});

class Navigator extends React.Component {
  componentDidMount() {
    NavigatorStore.on('change', this.updateStoreState);

    this.actions = new NavigatorActions();
    this.actions.init(this.props.rosClient);

    this.storeState = NavigatorStore.getState();

    this.navigatorGame = new NavigatorGame({storeState: this.storeState, useDatGui: this.props.useDatGui, actions: this.actions});
  }

  componentWillUnmount() {
    this.actions.dispose();

    NavigatorStore.removeListener('change', this.updateStoreState);
    this.navigatorGame.destroy();
  }

  updateStoreState = () => {
    this.storeState = NavigatorStore.getState();
    this.navigatorGame.setStoreState(this.storeState);
  };

  render() {
    const {classes} = this.props;

    const datGuiStyle = {
      position: 'absolute',
      top: '90px',
      right: '100px'
    };

    return (
    <Paper>
      <Grid container direction="column" justify="flex-start">
        <Grid item>
          <Paper className={classes.banner}>
            <Typography align="center">Navigator</Typography>
          </Paper>
        </Grid>
        <Grid item>
          <div id="phaser-map">
            <div id="phaser-map-dat-gui" style={datGuiStyle}/>
          </div>
        </Grid>
      </Grid>
    </Paper>);
  }
}

Map.defaultProps = {
  useDatGui: false
};

export default withRoot(withStyles(styles)(Navigator));
