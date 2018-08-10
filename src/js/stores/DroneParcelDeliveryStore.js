import {EventEmitter} from 'events';

import dispatcher from '../dispatcher';

import Immutable from 'immutable';

class DroneParcelDeliveryStore extends EventEmitter {
  constructor() {
    super();

    this.state = Immutable.fromJS(DroneParcelDeliveryStore.defaultState);
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
      case 'OBJECTS': {
        this.state = this.state.set('objects', Immutable.fromJS(action.objects));
        if (this.state.get('selectedObject') === '' && action.objects.length > 0) {
          this.state = this.state.set('selectedObject', action.objects[0].name);
        }
        this.emit('change');

        break;
      }
      case 'DELIVERY_QUEUE': {
        this.state = this.state.set('delivery_queue', Immutable.fromJS(action.deliveries));
        this.emit('change');

        break;
      }
      case 'SELECTED_OBJECT': {
        this.state = this.state.set('selectedObject', action.objectName);
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

DroneParcelDeliveryStore.defaultState = {
  locations: {},
  objects: {},
  delivery_queue: [],
  selectedLocation: '',
  selectedObject: '',
  report: '',
};

const droneParcelDeliveryStore = new DroneParcelDeliveryStore();
dispatcher.register(droneParcelDeliveryStore.handleActions.bind(droneParcelDeliveryStore));

export default droneParcelDeliveryStore;
