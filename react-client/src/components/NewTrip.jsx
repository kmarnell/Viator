import React from 'react';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import {Link} from 'react-router-dom';
import {Redirect} from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import Divider from 'material-ui/Divider';
import SignOutToolBar from './SignOutToolBar.jsx';
import $ from 'jquery';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import ActionFlightTakeoff from 'material-ui/svg-icons/action/flight-takeoff';
import {
  pink300, pink500, white
} from 'material-ui/styles/colors';



class NewTrip extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      finished: false,
      stepIndex: 0,
      airline: 'AS',
      flightNumber: '',
      finalDestination: '',
      date:''
    }
    this.handleNext = this.handleNext.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
    this.getStepContent = this.getStepContent.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDate = this.handleDate.bind(this);
    this.handleFlightNumber = this.handleFlightNumber.bind(this);
    this.handleFinalDestination = this.handleFinalDestination.bind(this);
    this.handleReturnFlightNumber = this.handleReturnFlightNumber.bind(this);
    this.handleReturnFlightDate = this.handleReturnFlightDate.bind(this);
  }

  isFlightInfoDefault () {
      let flightDefault = {
        flight: this.state.flightNumber,
        flightDestination: this.state.flightDestination,
        date: this.state.date,
        finalDestination: this.state.finalDestination
      };
      for (let key in flightDefault) {
        if (flightDefault[key] === "") {
          return key;
        }
      }
        return false;
    }; // end of isStateDefault

  handleNext () {
    const {stepIndex} = this.state;
    if (stepIndex ===1 && (this.state.flightNumber === '' || this.state.date === '') ) {
      alert(`Please update Flight Number and Start Date to proceed`)
    }
    else if (stepIndex === 2 && (this.state.flightNumber === '' || this.state.date === '') ) {
      alert(`Please update Flight Number and Start Date to proceed`)
    }
    else if (stepIndex === 3 && this.isFlightInfoDefault()) {
        alert(`Please update ${this.isFlightInfoDefault()} information`)
      } else {
    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 3,
      currentFieldNumber: '',
    });
    }
  };

  handlePrev () {
    this.setState({currentFieldNumber: ''})
    const {stepIndex} = this.state;
    if (stepIndex > 0) {
      this.setState({stepIndex: stepIndex - 1});
    }
  };
  handleChange (event, index, value) {
    this.setState({airline: value});
  };
  handleDate (event, date) {
    this.setState({date: date});
    console.log('date', date);
  };
  handleFlightNumber (event, flightNumber) {
    this.setState({flightNumber: flightNumber});
    this.setState({currentFieldNumber: flightNumber});
  };
  handleFinalDestination (event, address) {
    this.setState({finalDestination: address});
  };

  handleReturnFlightNumber (event, flightNumber) {
    this.setState({returnFlightNumber: flightNumber})
    this.setState({currentFieldNumber: flightNumber})
  }
  handleReturnFlightDate (event, date) {
    this.setState({returnDate: date});
  }


  getStepContent(stepIndex) {
    const styles = {
      wrapper: {
        display: 'flex',
        flexWrap: 'wrap',
      },
      chip: {
        margin: 4,
      }
    };
    let DateTimeFormat = global.Intl.DateTimeFormat;
    switch (stepIndex) {
      case 0:
        return (<MuiThemeProvider>
                  <SelectField
                    floatingLabelText='Airline'
                    value={this.state.airline}
                    onChange={this.handleChange}
                  >
                    <MenuItem value='AS' label='Alaska Airlines (AS)' primaryText='Alaska Airlines' />
                    <MenuItem value='AA' label='American Airlines (AA)' primaryText="American Airlines" />
                    <MenuItem value='DL' label='Delta Airlines (DL)' primaryText="Delta Airlines" />
                    <MenuItem value='F9' label='Frontier Airlines (F9)' primaryText='Frontier Airlines' />
                    <MenuItem value='B6' label='JetBlue (B6)' primaryText='JetBlue' />
                    <MenuItem value='WN' label='Southwest Airlines (WN)' primaryText='Southwest Airlines'/>
                    <MenuItem value='NK' label='Spirit Airlines (NK)' primaryText='Spirit Airlines' />
                    <MenuItem value='UA' label='United Airlines (UA)' primaryText='United Airlines' />
                    <MenuItem value='VX' label='Virgin America (VX)' primaryText='Virgin America' />
                  </SelectField>
                </MuiThemeProvider>
                );
      case 1:
        return (<div>
                  <MuiThemeProvider>
                    <Chip
                      backgroundColor={pink300}
                      style={styles.chip}
                    >
                      <Avatar
                        backgroundColor = {white}
                        color={pink500}
                        size={40}
                        icon={<ActionFlightTakeoff/>}
                      />
                      {this.state.airline}
                    </Chip>
                  </MuiThemeProvider>
                  <MuiThemeProvider>
                    <DatePicker
                      onChange={this.handleDate}
                      hintText="Flight Date"
                      firstDayOfWeek={0}
                      formatDate={new DateTimeFormat('en-US', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      }).format}/>
                  </MuiThemeProvider>
                  <MuiThemeProvider>
                    <Divider />
                  </MuiThemeProvider>
                  <MuiThemeProvider>
                    <TextField
                      floatingLabelText="Flight Number"
                      onChange={this.handleFlightNumber}
                      hintText="007"
                      id={2}
                      defaultValue={this.state.flightNumber}
                      floatingLabelFixed={true}
                      value = {this.state.currentFieldNumber}
                    />
                  </MuiThemeProvider>
                </div>
                );
        case 2:
          return (<div>
                    <MuiThemeProvider>
                      <Chip
                        backgroundColor={pink300}
                        style={styles.chip}
                      >
                        <Avatar
                          backgroundColor = {white}
                          color={pink500}
                          size={40}
                          icon={<ActionFlightTakeoff/>}
                        />
                        {this.state.airline}
                      </Chip>
                    </MuiThemeProvider>
                    <MuiThemeProvider>
                      <DatePicker
                        onChange={this.handleReturnFlightDate}
                        hintText="Flight Date"
                        firstDayOfWeek={0}
                        formatDate={new DateTimeFormat('en-US', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        }).format}/>
                    </MuiThemeProvider>
                    <MuiThemeProvider>
                      <Divider />
                    </MuiThemeProvider>
                    <MuiThemeProvider>
                      <TextField
                        floatingLabelText="Flight Number"
                        onChange={this.handleReturnFlightNumber}
                        hintText="008"
                        id={2}
                        defaultValue={this.state.returnFlightNumber}
                        floatingLabelFixed={true}
                        value={this.state.currentFieldNumber}
                      />
                    </MuiThemeProvider>
                  </div>
                  );
      case 3:
        return (<div>
                  <div style={styles.wrapper}>
                    <MuiThemeProvider>
                      <Chip
                        style = {styles.chip}
                        backgroundColor={pink300}
                      >
                        <Avatar
                          backgroundColor = {white}
                          color={pink500}
                          size={40}
                          icon={<ActionFlightTakeoff/>}
                        />
                        {this.state.airline}
                      </Chip>
                    </MuiThemeProvider>
                    <MuiThemeProvider>
                      <Chip
                        style = {styles.chip}
                        backgroundColor={pink300}
                      >
                        <Avatar
                          backgroundColor = {white}
                          color={pink500}
                          size={40}>
                          #
                        </Avatar>
                        {this.state.flightNumber}
                      </Chip>
                    </MuiThemeProvider>
                  </div>
                  <MuiThemeProvider>
                    <TextField
                      id={1}
                      floatingLabelText="Destination Address"
                      onChange={this.handleFinalDestination}
                      defaultValue={this.state.finalDestination}
                      hintText="944 Market Street San Francisco"
                      floatingLabelFixed={true}
                    />
                  </MuiThemeProvider>
                </div>
                );
      default:
        return 'You\'ve somehow found a bug in our code, well done!';
    }
  };


saveData() {
  var context = this;
  console.log(context.state.airline);
  $.ajax({
    type: 'POST',
    url: '/database/save',
    contentType: 'application/JSON',
    data: JSON.stringify({
      airline: context.state.airline,
      flightNumber: context.state.flightNumber,
      finalDestination: context.state.finalDestination,
      date: context.state.date,
      returnFlightNumber: context.state.returnFlightNumber,
      returnDate: context.state.returnDate
        })
      })
      .done(function(data) {

      console.log('url:/db/save POST Successful');
      })
      .fail(function(err) {
      console.error('POST failed');
    })
  };

  render () {
    console.log('return date', this.state.returnDate)
    console.log('date', this.state.date)

    const {finished, stepIndex} = this.state;
    const styles = {
      contentStyle: {
        margin: '0 16px',
      },
    }
    return (
      <div>
        <SignOutToolBar/>
        <div style={{width: '100%', maxWidth: 800, margin: 'auto'}}>
          <MuiThemeProvider>
            <Stepper activeStep={stepIndex}>
              <Step>
                <StepLabel>Select Airline</StepLabel>
              </Step>
              <Step>
                <StepLabel>Choose Destination Flight # & Date</StepLabel>
              </Step>
              <Step>
                <StepLabel>Choose Return Flight # & Date (optional)</StepLabel>
              </Step>
              <Step>
                <StepLabel>Add Final Destination Address</StepLabel>
              </Step>
            </Stepper>
          </MuiThemeProvider>
          <div style={styles.contentStyle}>

            {finished ? ( this.saveData() ||
              <Redirect push to="/dashboard" />) : (

              <div>
                {this.getStepContent(stepIndex)}
                <div style={{marginTop: 12}}>
                  <MuiThemeProvider>
                    <FlatButton
                      label="Back"
                      disabled={stepIndex === 0}
                      onClick={this.handlePrev}
                      style={{marginRight: 12}}
                    />
                  </MuiThemeProvider>
                  <MuiThemeProvider>
                    <RaisedButton
                      label={stepIndex === 3 ? 'Finish' : 'Next'}
                      primary={true}
                      onClick={this.handleNext}
                    />
                  </MuiThemeProvider>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default NewTrip;
