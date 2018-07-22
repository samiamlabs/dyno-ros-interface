import {EventEmitter} from 'events';

import dispatcher from '../dispatcher';

import Immutable from 'immutable';

class AppStore extends EventEmitter {
  constructor() {
    super();

    this.state = Immutable.fromJS(AppStore.defaultState);
  }

  getState() {
    return this.state;
  }

  handleActions(action) {
    switch (action.type) {
      case 'RUNNING_CAPABILITIES': {
        this.state = this.state.set(
          'running_capabilities',
          Immutable.fromJS(action.running)
        );
        this.emit('change');
        break;
      }
      case 'AVAILABLE_RAPPS': {
        action.availableRapps.forEach(rapp => {
          this.state = this.state.setIn(
            ['available_rapps', rapp.name],
            Immutable.fromJS(rapp)
          );
        });

        this.emit('change');
        break;
      }
      default:
      // do notihing
    }
  }
}

AppStore.defaultState = {
  running_capabilities: [],
  available_rapps: {}
};

const appStore = new AppStore();
dispatcher.register(appStore.handleActions.bind(appStore));

export default appStore;
