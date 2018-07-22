import {EventEmitter} from 'events';

import dispatcher from '../dispatcher';

import Immutable from 'immutable';

class RouteSchedulerStore extends EventEmitter {
  constructor() {
    super();

    this.state = Immutable.fromJS(RouteSchedulerStore.defaultState);
  }

  getState() {
    return this.state;
  }

  handleActions(action) {
    switch (action.type) {
      case 'LOCATIONS': {
        this.state = this.state.set('locations', Immutable.fromJS(action.locations));
        if (this.state.get('selectedLocation') === '' && action.locations.length > 0) {
          this.state = this.state.set('selectedLocation', action.locations[0].name);
        }
        this.emit('change');

        break;
      }
      case 'LOCATION_QUEUE': {
        this.state = this.state.set('location_queue', Immutable.fromJS(action.locations));
        this.emit('change');

        break;
      }
      case 'SELECTED_LOCATION': {
        this.state = this.state.set('selectedLocation', action.locationName);
        this.emit('change');
        break;
      }
      case 'REPORT': {
        this.state = this.state.set('report', action.report);
        this.emit('change');
        break;
      }
      default:
      // do notihing
    }
  }
}

RouteSchedulerStore.defaultState = {
  locations: {},
  location_queue: {},
  selectedLocation: '',
  report: '',
};

const routeSchedulerStore = new RouteSchedulerStore();
dispatcher.register(routeSchedulerStore.handleActions.bind(routeSchedulerStore));

export default routeSchedulerStore;
