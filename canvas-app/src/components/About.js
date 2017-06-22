import React, { Component } from 'react';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import { connect } from 'react-redux';
import {openSignModal} from '../actionCreators/modalStatus'
import CreateAccountModal from './CreateAccountModal'


class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
      finished: false,
      stepIndex: 0,
    };

    this.handleNext = this.handleNext.bind(this);
    this.handlePrev = this.handleNext.bind(this);
    //this.handleRestart = this.handleRestart.bind(this);
    this.jumpToState = this.jumpToState.bind(this);
    this.open = this.open.bind(this);
  }

  handleNext(){
    const {stepIndex} = this.state;
    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 2
    })
  }

  handlePrev(){
    const {stepIndex} = this.state;
    if(stepIndex > 0) {
      this.setState({
        stepIndex: stepIndex - 1
      })
    }    
  }

  // handleRestart(e){
  //   e.preventDefault();
  //   this.setState({
  //     stepIndex: 0, 
  //     finished: false
  //   });
  // }

  jumpToState(id){
    this.setState({
      stepIndex: id
    })
  }

  getStepContent(stepIndex) {
    if(stepIndex === 0){
      return 'Create a new account...';
    } else if(stepIndex === 1){
      return 'Send the link to your friends';
    } else if(stepIndex === 2){
      return 'Take all the benefits of a collaborative draw';
    } else {
      return 'Start drawing now!!';
    }
  }

  open() {
    this.props.open();
  }


  render() {
    const {finished, stepIndex} = this.state;
    const contentStyle = {margin: '0 16px'};

    return (
      <div style={{width: '100%', maxWidth: 700, margin: 'auto'}}>
        <Stepper activeStep={stepIndex}>
          <Step onClick={() => this.jumpToState(0)}>
            <StepLabel>Create an account</StepLabel>
          </Step>
          <Step onClick={() => this.jumpToState(1)}>
            <StepLabel>Invite your friends</StepLabel>
          </Step>
          <Step onClick={() => this.jumpToState(2)}>
            <StepLabel>Draw!!</StepLabel>
          </Step>
        </Stepper>
        <div style={contentStyle}>
          {finished ? (
            <p>
              <a onClick={this.open} >
                Click here
              </a> to create account.
            </p>
          ) : (
            <div>
              <p>{this.getStepContent(stepIndex)}</p>
              <div style={{marginTop: 12}}>
                <FlatButton
                  label="Create account"
                  style={{marginRight: 12}}
                  onTouchTap={this.open}
                />
                <RaisedButton
                  label={stepIndex === 2 ? 'Finish' : 'Next'}
                  primary={true}
                  onTouchTap={this.handleNext}
                />
              </div>
            </div>
          )}
        </div>
        <CreateAccountModal />
      </div>
    );
  }
}

const mapDispatchToProps = {
  open: () => openSignModal()
}

export default connect(null, mapDispatchToProps)(About);