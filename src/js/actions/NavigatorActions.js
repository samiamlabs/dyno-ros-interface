import dispatcher from '../dispatcher';
import pako from 'pako';

export default class NavigatorActions {
  init = rosClient => {
    this.rosClient = rosClient;

    this.robotPoseListener = this.rosClient.topic.subscribe('/robot_pose', 'geometry_msgs/PoseStamped', message => {
      dispatcher.dispatch({type: 'ROBOT_POSE', pose: message.pose});
    });

    // Throttle at 800ms
    // this.mapListener = this.rosClient.topic.subscribe(
    //   '/map',
    //   'nav_msgs/OccupancyGrid',
    //   message => {
    //     dispatcher.dispatch({
    //       type: 'MAP',
    //       mapInfo: message.info,
    //       mapData: message.data
    //     });
    //   },
    //   'png',
    //   800
    // );
    this.getMap();
  };

  getMap = () => {

    // console.log(this.rosClient)
    // console.log("calling")

    // fetch('http://localhost:5000/map').then(response => response.json()).then(function(map_json) {
    //   const map = JSON.parse(map_json);
    //   dispatcher.dispatch({type: 'MAP', mapInfo: map.info, mapData: map.data});
    // });


    this.rosClient.service
      .callWithCompression(
        '/get_map',
        'dyno_msgs/GetMap',
        {}
      )
      .then(result => {
        const raw = atob(result.data);
        const rawLength = raw.length
        const dataArray = new Uint8Array(new ArrayBuffer(rawLength));
        for (var i = 0; i < rawLength; i++){
          dataArray[i] = (raw.charCodeAt(i));
        }

        const decompressedData = Int8Array.from(pako.inflate(dataArray));

        dispatcher.dispatch({
          type: 'MAP',
          mapInfo: result.info,
          mapData: decompressedData
        });

      });
  };

  sendNavigationGoal = pose => {
    const header = {
      seq: 0,
      stamp: 0,
      frame_id: 'map'
    };

    this.rosClient.topic.publish('/move_base_simple/goal', 'geometry_msgs/PoseStamped', {pose, header});
  };

  dispose = () => {
    this.robotPoseListener.dispose();
    // this.mapListener.dispose();
  };
}
