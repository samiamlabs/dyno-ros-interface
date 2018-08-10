// @flow

import dispatcher from '../dispatcher';

class DroneParcelDeliveryActions {
  connect = (rosClient: Object): void => {
    this.rosClient = rosClient;

    this.locationsListener = this.rosClient.topic.subscribe(
      '/world_state/locations',
      'dyno_msgs/LocationArray',
      message => {
        dispatcher.dispatch({
          type: 'LOCATIONS',
          locations: message.locations
        });
      }
    );

    this.objectsListener = this.rosClient.topic.subscribe(
      '/world_state/objects',
      'dyno_msgs/ObjectArray',
      message => {
        dispatcher.dispatch({
          type: 'OBJECTS',
          objects: message.objects
        });
      }
    );

    this.locationQueueListener = this.rosClient.topic.subscribe(
      '/drone_parcel_delivery/delivery_queue',
      'dyno_msgs/DeliveryArray',
      message => {
        dispatcher.dispatch({
          type: 'DELIVERY_QUEUE',
          deliveries: message.deliveries
        });
      }
    );

    this.reportListener = this.rosClient.topic.subscribe(
      '/drone_parcel_delivery/report',
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

  setSelectedObject = name => {
    dispatcher.dispatch({
      type: 'SELECTED_OBJECT',
      objectName: name
    });
  };

  setSelectedLocation = name => {
    dispatcher.dispatch({
      type: 'SELECTED_LOCATION',
      locationName: name
    });
  };

  addDelivery = (object_name: string, location_name: string): void => {
    this.rosClient.topic.publish(
      '/drone_parcel_delivery/add_delivery',
      'dyno_msgs/Delivery',
      {
        object_name,
        location_name
      }
    );
  };

  start = (): void => {
    this.rosClient.topic.publish(
      '/drone_parcel_delivery/start',
      'std_msgs/Empty',
      {}
    );
  };

  stop = (): void => {
    this.rosClient.topic.publish(
      '/drone_parcel_delivery/stop',
      'std_msgs/Empty',
      {}
    );
  };

  clear = (): void => {
    this.rosClient.topic.publish(
      '/drone_parcel_delivery/clear',
      'std_msgs/Empty',
      {}
    );
  }
}

const droneParcelDeliveryActions = new DroneParcelDeliveryActions();
export default droneParcelDeliveryActions;
