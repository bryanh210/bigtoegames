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
  TouchableOpacity,
  Dimensions,
  ScrollView,
  PanResponder,
  Animated
} from 'react-native';
import {
  Body,
  Loop,
  Stage,
  World,
} from 'react-game-kit/native';
import Matter from 'matter-js';
export default class demo extends Component {
  handleUpdate = () => {
    console.log('y height:',this.arrow.body.position.y)
    this.setState({
      arrowPosition: this.arrow.body.position,
      arrowAngle: this.arrow.body.angle,
      personPosition:this.person.body.position,
      personAngle:this.person.body.angle,
      arrowBody: this.arrow.body
    });
    if(this.state.arrowReleased){
      this.setState({
        arrowAngle: Math.atan(this.arrow.body.velocity.y/this.arrow.body.velocity.x)* (180/Math.PI) + 180,
        x:this.arrow.body.position.x-100
      })
    }
    _scrollView.scrollTo({x: this.arrow.body.position.x-100, y:0, animated: false});
    if(this.arrow.body.position.y>530) {
      Matter.Body.setStatic(this.arrow.body, true)
    }
  }
  physicsInit = (engine) => {
    Matter.Detector.canCollide = function (filterA, filterB) {
      //".group" specifiies which group the collection belongs to
      //this logic just makes sure that group A can't collide with group B
      //the same if you just return true
      return true;
    }

    var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Vector = Matter.Vector,
    //Composite creates and manipulate composite bodies
    Composite = Matter.Composite,
    Constraint = Matter.Constraint,
    MouseConstraint = Matter.MouseConstraint;

//Create Constraint
  consFuckingStraint = Matter.Constraint.create;

    const dimensions = Dimensions.get('window');
    const _ground = Matter.Bodies.rectangle(
      dimensions.width / 2, dimensions.height + 5,
      100000, 5,
      {
        isStatic: true,
        render: {
          fillStyle: 'red',
          strokeStyle: '#D7FBE8'
        }
      });
      Matter.World.add(engine.world,[_ground] );
    }
    constructor(props) {
      super(props);
      this.state = {
        gravity: 0,
        arrowPosition: {
          x: 40,
          y: 90,
        },
        arrowReleased: false,
        arrowAngle: 180 ,
        trumpPosition:{
          x:40.5,
          y:90.5
        },
        arrowBody:{},
        personPosition:{
          x:30,
          y:70
        },
        personAngle:180,
        x:0
      };
    }
    componentWillMount() {
      this._panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => true,
        onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
        onMoveShouldSetPanResponder: (evt, gestureState) => true,
        onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
        onPanResponderGrant: (evt, gestureState) => {
          this.setState({
            gravity: 0,
          });
          Matter.Body.setVelocity(this.arrow.body, {x: 0, y: 0});
          this.startPosition = {
            x: this.arrow.body.position.x,
            y: this.arrow.body.position.y,
          }
        },
        onPanResponderMove: (evt, gestureState) => {
          console.log('x', gestureState.dx)
          console.log('y', gestureState.dy)
          console.log('angle', this.state.arrowAngle)
          Matter.Body.setPosition(this.arrow.body, {
            x: this.startPosition.x ,
            y: this.startPosition.y ,
          });
          Matter.Body.setAngle(this.arrow.body, Math.atan(gestureState.dy/gestureState.dx)* (180/Math.PI) + 180)
        },
        onPanResponderRelease: (evt, gestureState) => {
          console.log('evt', evt);
          this.setState({
            gravity: 1,
            arrowReleased: true
          });
          //  this.state.arrowAngle = Math.atan2(gestureState.dy/gestureState.dx)*(180/Math.PI)
          Matter.Body.applyForce(this.arrow.body, {
            x: this.arrow.body.position.x,
            y: this.arrow.body.position.y,
          }, {
            x: -gestureState.dx*0.02,
            y: -gestureState.dy*0.02,
          });
        },
      });
      console.log(this.arrow)
    }
    getArrowStyles() {
      return {
        height: 75,
        width: 75,
        position: 'absolute',
        transform: [
          { translateX: this.state.arrowPosition.x },
          { translateY: this.state.arrowPosition.y },
          { rotate: this.state.arrowAngle + 'deg'}
        ],
      };
    }

    getTrumpStyles() {
      return {
        height: 75,
        width: 75,
        position: 'absolute',
        transform: [
          { translateX: 41 },
          { translateY: 91 }

        ],
      };
    }

    getPersonStyles() {
      return {
        height:75,
        width:75,
        position:'absolute',
        transform: [
          { translateX: this.state.personPosition.x },
          { translateY: 500 },
          { rotate: this.state.personAngle + 'deg'}
        ],
      }
    }

    render() {
      const dimensions = Dimensions.get('window');
      return (
        <Loop>
        <Animated.View {...this._panResponder.panHandlers}>
        <Stage
        width={dimensions.width }
        height={dimensions.height}
        style={{backgroundColor:'yellow'}}
        >
        <ScrollView  ref={(scrollView) => { _scrollView = scrollView; }}showsHorizontalScrollIndicator={false} horizontal={true}>
        <World
        onInit={this.physicsInit}
        onUpdate={this.handleUpdate}
        gravity={{ x: 0, y: this.state.gravity, scale: 0.001 }}
        >
        <Text style={{marginTop:20,marginLeft:3000}}>
        hello World
        </Text>
        <View style={{marginLeft:2000}}>
        <Image source={require('./assets/Lakitu_Cloud.png')} />
        </View>
        <View style={{marginTop:30,marginLeft:this.state.x}}>
        <Image source={require('./assets/GreenLine.png')} />
        </View>
        <Body
        shape="rectangle"
        args={[100,dimensions.height-300, 75,75]}
        density={.005}
        friction={1}
        frictionStatic={0}
        restitution={0.5}
        angle={180}
        ref={(b) => { this.arrow = b; }}
        collisionFilter= {{
          group: 1,
          collidesWith: [0, 1]
        }}
        >
        <View
        style={this.getArrowStyles()} {...this._panResponder.panHandlers}
        >
        <Image
        source={require('./assets/arrow2.png')}
        />
        </View>
        </Body>
        <Body
        shape="rectangle"
        args={[100,dimensions.height-300, 100,155]}
        density={.005}
        friction={1}
        frictionStatic={0}
        restitution={0.5}
        angle={180}
        ref={(b) => { this.arrow = b; }}
        collisionFilter= {{
          group: 1,
          collidesWith: [0, 1]
        }}
       setStatic={{
         console.log('setStatic'),
          body: this.setState.arrowBody,
          boolean: true
        }}
        >
        <View
        style={this.getTrumpStyles()} {...this._panResponder.panHandlers}
        >
        <Image
        source={require('./assets/trump1.png')}
        />
        </View>
        </Body>
        <Body
        shape="rectangle"
        args={[4000,dimensions.height, 100,140]}
        density={.005}
        friction={1}
        frictionStatic={0}
        restitution={0.5}
        angle={0}
        ref={(b) => { this.person = b; }}
        >
        <View
        style={this.getPersonStyles()}
        >
        <Image
        source={require('./assets/Rectangle.png')}
        />
        </View>
        </Body>
        </World>
        </ScrollView>
        </Stage>
        </Animated.View>
        </Loop>
      );
    }
  }
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
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
