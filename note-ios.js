/**
* Sample React Native App
* https://github.com/facebook/react-native
* @flow
*/

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  PanResponder
} from 'react-native';

import {
  Body,
  Loop,
  Stage,
  World,
  TileMap
} from 'react-game-kit/native';
//World = providing physics
//Body defines physics inline
//Stage = Main game container to which game entities are added
//Loop: get input, update game state & draw the game

import Matter from 'matter-js';
//Matter-js: 2D physics engine

export default class demo extends Component {

  handleUpdate = () => {
    //this.setState is to set a new state, not just set the initial state
    this.setState({
      ballPosition: this.body.body.position,
      ballAngle: this.body.body.angle,
    });
  }


  //boiler plate code to provide physic helper
  physicsInit = (engine) => {

    //dimension = screen width
    const dimensions = Dimensions.get('window');

    //to create a rectangle-shaped rigid-model ground
    const ground = Matter.Bodies.rectangle(
      dimensions.width / 2, dimensions.height + 5,
      dimensions.width, 5,
      //static matter
      {
        isStatic: true,
      },
    );

    const ceiling = Matter.Bodies.rectangle(
      dimensions.width / 2, -75,
      dimensions.width, 1,
      {
        isStatic: true,
      },
    );

    const leftWall = Matter.Bodies.rectangle(
      -75, dimensions.height / 2,
      1, dimensions.height,
      {
        isStatic: true,
      },
    );

    const rightWall = Matter.Bodies.rectangle(
      dimensions.width, dimensions.height / 2,
      1, dimensions.height - 5,
      {
        isStatic: true,
      },
    );

    //put all of this into a functio

    //experimenting with putting tile map in
    TileMapInit = () => {
      const tileMap = {
        rows: 4,
        columns: 8,
        layers: [
          [
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            1, 1, 1, 1, 1, 1, 1, 1,
          ],
        ],
      };

      var rows = tileMap.rows;
      var columns = tileMap.columns;
      var layers = tileMap.layers;



        layers.forEach((l, index) => {
          const layer = [];
          for (let r = 0; r < rows; r++) { // Loop over rows
            for (let c = 0; c < columns; c++) { // Loop over columns
              const gridIndex = (r * columns) + c; // Get index in grid
              if (layer[gridIndex] !== 0) { // If it isn't 0
              layer.push({
                row: r,
                column: c,
                tileIndex: layer[gridIndex]
              })
            }
          }
        }
      })
    };
    // getTileStyles(column, row, size) {
    //
    //   const left = column * size;
    //   const top = row * size;
    //
    //   return {
    //     height: size,
    //     width: size,
    //     overflow: 'hidden',
    //     position: 'absolute',
    //     // transform: `translate(${left}px, ${top}px)`
    //     transform: [
    //       { translateX: left.x },
    //       { translateY: top.y },
    //
    //     ],
    //   }
    // };
//   }
// }


    // getBallStyles() {
    //   return {
    //     height: 75,
    //     width: 75,
    //     position: 'absolute',
    //     transform: [
    //       { translateX: this.state.ballPosition.x },
    //       { translateY: this.state.ballPosition.y },
    //       { rotate: (this.state.ballAngle * (180 / Math.PI)) + 'deg'}
    //     ],
    //   };
    // }

    //Engine.World : A World composite object that will contain all simulated bodies and constraints.
    Matter.World.add(engine.world, [ground, leftWall, rightWall, ceiling]);
  }

  constructor(props) {
    super(props);

    this.state = {
      gravity: 1,
      ballPosition: {
        x: 0,
        y: 0,
      },
      ballAngle: 0,
    };
  }

  componentWillMount() {
    //PanResponder combines several touches into 1
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        this.setState({
          gravity: 0,
        });

        Matter.Body.setAngularVelocity(this.body.body, 0);
        Matter.Body.setVelocity(this.body.body, {x: 0, y: 0});

        this.startPosition = {
          x: this.body.body.position.x,
          y: this.body.body.position.y,
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        Matter.Body.setPosition(this.body.body, {
          x: this.startPosition.x + gestureState.dx,
          y: this.startPosition.y + gestureState.dy,
        });
      },
      onPanResponderRelease: (evt, gestureState) => {
        this.setState({
          gravity: 1,
        });

        Matter.Body.applyForce(this.body.body, {
          x: this.body.body.position.x,
          y: this.body.body.position.y,
        }, {
          x: gestureState.vx,
          y: gestureState.vy,
        });
      },
    });
  }

  getBallStyles() {
    return {
      height: 75,
      width: 75,
      position: 'absolute',
      transform: [
        { translateX: this.state.ballPosition.x },
        { translateY: this.state.ballPosition.y },
        { rotate: (this.state.ballAngle * (180 / Math.PI)) + 'deg'}
      ],
    };
  }

  getDonaldTrump() {
    return {
      height: 40,
      width: 40,
      position: 'absolute',
    };
  }

  render() {
    const dimensions = Dimensions.get('window');
    return (
      <Loop>
      <Stage
      width={dimensions.width}
      height={dimensions.height}
      style={{ backgroundColor: 'yellow' }}
      >
      <World
      onInit={this.physicsInit}
      onUpdate={this.handleUpdate}
      gravity={{ x: 0, y: this.state.gravity, scale: 0.001 }}
      >
      <Body
      shape="circle"
      args={[0, dimensions.height - 75, 75]}
      density={0.003}
      friction={1}
      frictionStatic={0}
      restitution={0.5}
      ref={(b) => { this.body = b; }}
      >
      <View
      style={this.getBallStyles()} {...this._panResponder.panHandlers}
      >
      <Image
      source={require('./assets/boxinggl.png')}
      height={75}
      width = {75}
      />
      </View>
      </Body>
      <Body
      shape="circle"
      args={[0, dimensions.height - 75, 75]}
      density={0.003}
      friction={1}
      frictionStatic={0}
      restitution={0.5}
      ref={(b) => { this.body = b; }}
      >
      <View
      style={this.getDonaldTrump()} {...this._panResponder.panHandlers}
      >
      <Image
      source={require('./assets/trump1.png')}
      height={75}
      width = {75}
      />
      </View>
      </Body>
      <TileMap
      src="assets/boardwalktile.png"
      tileSize={128}
      columns={24}
      rows={4}
      layers={[
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        ],
      ]}
      />

      </World>
      </Stage>
      </Loop>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafff5',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('demo', () => demo);
