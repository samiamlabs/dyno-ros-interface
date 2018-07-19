class CartographerActions {
  connect = (rosClient: Object): void => {
    this.rosClient = rosClient;
  };

  disconnect = (): void => {
    if (typeof this.rosClient !== 'undefined') {
    }
  };

  saveState = (): void => {
    this.rosClient.service
      .call('/save_cartographer_state', 'std_srvs/Empty', {})
      .then(result => {
        console.log('saved');
      });
  };

  finishTrajectory = (id: number): void => {
    this.rosClient.service
      .call('/finish_trajectory', 'cartographer_ros_msgs/FinishTrajectory', {trajectory_id: id})
      .then(result => {
        console.log('trajectory saved');
      });
  };
}

const cartographerActions = new CartographerActions();
export default cartographerActions;
