// @flow

import dispatcher from '../dispatcher';

class RouteSchedulerActions {
  connect = (rosClient: Object): void => {
    this.rosClient = rosClient;

    this.locationsListener = this.rosClient.topic.subscribe(
      '/world_state/locations',
      'dyno_world_state/LocationArray',
      message => {
        dispatcher.dispatch({
          type: 'LOCATIONS',
          locations: message.locations
        });
      }
    );

    this.locationQueueListener = this.rosClient.topic.subscribe(
      '/route_scheduler/location_queue',
      'dyno_world_state/LocationArray',
      message => {
        dispatcher.dispatch({
          type: 'LOCATION_QUEUE',
          locations: message.locations
        });
      }
    );

    this.reportListener = this.rosClient.topic.subscribe(
      '/route_scheduler/report',
      'std_msgs/String',
      message => {
        dispatcher.dispatch({
          type: 'REPORT',
          report: message.data
        });
      }
    );
  };

  disconnect = (): void => {
    if (typeof this.rosClient !== 'undefined') {
      this.locationsListener.dispose();
      this.locationQueueListener.dispose();
      this.reportListener.dispose();
    }
  };

  setSelectedLocation = name => {
    dispatcher.dispatch({
      type: 'SELECTED_LOCATION',
      locationName: name
    });
  };

  addLocation = (name: string): void => {
    this.rosClient.topic.publish(
      '/route_scheduler/add_location',
      'std_msgs/String',
      {
        data: name
      }
    );
  };

  start = (): void => {
    this.rosClient.topic.publish(
      '/route_scheduler/start',
      'std_msgs/Empty',
      {}
    );
  };

  stop = (): void => {
    this.rosClient.topic.publish(
      '/route_scheduler/stop',
      'std_msgs/Empty',
      {}
    );
  };

  clear = (): void => {
    this.rosClient.topic.publish(
      '/route_scheduler/clear',
      'std_msgs/Empty',
      {}
    );
  }
}

const worldStateActions = new RouteSchedulerActions();
export default worldStateActions;
