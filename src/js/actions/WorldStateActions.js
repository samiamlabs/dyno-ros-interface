// @flow

class WorldStateActions {
  connect = (rosClient: Object): void => {
    this.rosClient = rosClient;
  };

  disconnect = (): void => {
    if (typeof this.rosClient !== 'undefined') {
    }
  };

  addCurrentLocation = (): void => {
    this.rosClient.service
      .call('/world_state/add_current_location', 'std_srvs/Empty', {})
      .then(result => {
        console.log('current pose added as location');
      });
  };

  clearLocations = (): void => {
    this.rosClient.service
      .call('/world_state/clear_locations', 'std_srvs/Empty', {})
      .then(result => {
        console.log('locations cleared');
      });
  };

}

const cartographerActions = new WorldStateActions();
export default cartographerActions;
