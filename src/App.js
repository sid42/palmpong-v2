import React, { Component } from 'react';
import Konva from 'konva';
import { render } from 'react-dom';
import { Stage, Layer, Rect, Text, Circle } from 'react-konva';
//import * as bodyPix from '@tensorflow-models/body-pix';

// import Paddle from './Paddle'

class Paddle extends React.Component {
  render() {
    return (
      <Rect
        x={this.props.locationX}
        y={this.props.locationY}
        width={10}
        height={50}
        fill="red"
        shadowBlur={5}
      />
    );
  }
}

class Ball extends React.Component {
  render() {
    return (
      <Circle
        x={this.props.locationX} y={this.props.locationY} radius={10} fill="black"
      />
    )
  }
}

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      paddle1X : 20,
      paddle1Y : window.innerHeight/2,
      paddle2X : window.innerWidth - 25,
      paddle2Y : window.innerHeight/2,
      ballX : window.innerWidth/2,
      ballY : window.innerHeight/2,
      ballVelocityX : 1,
      ballVelocityY : 1,    
    }
  }

  componentDidMount(){
    // var constraints = {
    //   audio: false,
    //   video: {
    //     width: 480, height: 480,
    //   }
    // }
    // const video = document.getElementById('video');
    // try{
    //   const stream = navigator.mediaDevices.getUserMedia(constraints)
    //   window.stream = stream;
    //   video.srcObject = stream;
    // } catch(e){
    //   console.log('lol gandu initiated')
    // }

    setInterval(() => {
      this.setState({
        ballX : this.state.ballX + this.state.ballVelocityX,
        ballY : this.state.ballY + this.state.ballVelocityY,
      })

      if(this.state.ballX > window.innerWidth || this.state.ballX <= 0)
        this.state.ballVelocityX = -this.state.ballVelocityX
      if(this.state.ballY > window.innerHeight || this.state.ballY <= 0)
        this.state.ballVelocityY = -this.state.ballVelocityY

      if(this.state.ballX < window.innerWidth/2){
        // let diff = this.state.ballY - this.state.paddle1Y
        // let paddleVelocity = diff < 0 ? 0.5 : -0.5
        // this.state.paddle1Y += paddleVelocity
        this.state.paddle1Y = this.state.ballY
      }
    }, 1)

    // while(this.state.ballX < window.innerWidth/2){
    //   console.log(1)
    //   // paddle1Y += paddleVelocity
    // }
  }

  render() {
    return (
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <Paddle locationX={this.state.paddle1X} locationY={this.state.paddle1Y}/>
          <Ball locationX={this.state.ballX} locationY={this.state.ballY}/>
          <Paddle locationX={this.state.paddle2X} locationY={this.state.paddle2Y}/>
        </Layer>
      </Stage>
    );
  }
}

export default App