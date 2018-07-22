// @flow

class WorldStateActions {
  connect = (rosClient: Object): void => {
    this.rosClient = rosClient;
  };

  disconnect = (): void => {
    if (typeof this.rosClient !== 'undefined') {
    }
  };

  addCurrentLocation = (name: string): void => {
    this.rosClient.service
      .call(
        '/world_state/add_current_location',
        'dyno_world_state/AddCurrentLocation',
        {name}
      )
      .then(result => {
      });
  };

  clearLocations = (): void => {
    this.rosClient.service
      .call('/world_state/clear_locations', 'std_srvs/Empty', {})
      .then(result => {
      });
  };

  saveLocations = (): void => {
    this.rosClient.service
      .call('/world_state/save', 'std_srvs/Empty', {})
      .then(result => {
      });
  };

  loadLocations = (): void => {
    this.rosClient.service
      .call('/world_state/load', 'std_srvs/Empty', {})
      .then(result => {
      });
  };
}

const cartographerActions = new WorldStateActions();
export default cartographerActions;
