import React, { Component } from 'react';
import Konva from 'konva';
import { render } from 'react-dom';
import { Stage, Layer, Rect, Text, Circle } from 'react-konva';
import * as bodyPix from '@tensorflow-models/body-pix';

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
      ballVelocityX : 5,
      ballVelocityY : 5,    
    }
  }

  async componentDidMount(){
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var image = document.getElementById('image')
    var constraints = {
      audio: false,
      video: {
        height: 480,
        width: 480,
      }
    }
    const video = document.getElementById('video');
    try{
      var stream = navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        video.srcObject = stream
      })
    }catch(e){
      console.log('something went wrong' + e)
    }
    
    var net
    video.onloadeddata = () => {  
      video.width = video.videoWidth
      video.height = video.videoHeight
      net = bodyPix.load({
        architecture: 'MobileNetV1',
        outputStride: 16,
        multiplier: 0.75,
        quantBytes: 2
      })
    }

    var elem = this
    function animationCycle() {
      if(net != null){
        elem.setState({
          ballX : elem.state.ballX + elem.state.ballVelocityX,
          ballY : elem.state.ballY + elem.state.ballVelocityY,
        })
  
        //handling wall collisions
        if(elem.state.ballX > window.innerWidth || elem.state.ballX <= 0)
          elem.state.ballVelocityX = -elem.state.ballVelocityX
        if(elem.state.ballY > window.innerHeight || elem.state.ballY <= 0)
          elem.state.ballVelocityY = -elem.state.ballVelocityY
  
        //handling paddle AI
        if(elem.state.ballX < window.innerWidth/2){
          elem.state.paddle1Y = elem.state.ballY
        }
  
        var segment = net.then((result) => {
          return result.segmentPersonParts(video, {
            internalResolution: 'medium',
            segmentationThreshold: 0.75
          })
        }).then((result) => {
          var pixels = result.data.reduce((acc, elem, idx) => {
            if (elem === 11)
              acc.push(idx)
            return acc
          }, [])

          var yMin = 45;
          var yMax = 450
          var yCumulative = pixels.reduce((acc, elem) => {
            var height = elem/480
            acc += height
            return acc
          }, 0)

          var avgY = 0
          if(pixels.length !== 0)
            avgY = (((yCumulative/pixels.length) - yMin)/(yMax - yMin))*750

          elem.state.paddle2Y = avgY
          console.log(avgY)
          // console.log(elem.state.paddle1Y)
        })
        // console.log(net)
      }
      window.requestAnimationFrame(animationCycle)
    }

    animationCycle()
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