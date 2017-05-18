import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import EventSeat from 'material-ui/svg-icons/action/event-seat';
import Avatar from 'material-ui/Avatar';
import Arrow from 'material-ui/svg-icons/navigation/arrow-forward';
import Divider from 'material-ui/Divider';
import $ from 'jquery';
import ReactHighcharts from 'react-highcharts';
import {
  grey500, white, green500,
} from 'material-ui/styles/colors';


class EventListCard extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      config: {},
      data:[],
      dates: [],
      count:[]
    }
  }

  render() {
    if (this.props.events) {
      var events = Object.entries(this.props.events)
    }
    const styles = {
      card: {
        width: '100%',
        height: 400,
      },
      gridList: {
        width: '100%',
        height: '80%',
        overflowY: 'auto',
      },
      avatar: {
        backgroundColor: green500,
      },
      cardHeader: {
        height: '20%',
      },
      chart: {
        width: '80%'
      }
    }
    return (
      <div>
        <Card
          style={styles.card}>
          <CardHeader
            title="Nearby Events"
            subtitle="Eventbrite activities nearby"
            avatar={<Avatar icon={<EventSeat />}
              style={styles.avatar}
              color={white}/>}
            style={styles.cardHeader}
          />
          <Divider/>
          <GridList
            cellHeight={100}
            style={styles.gridList}
          >
            {events.map((event) => (
              <GridTile
                key={event[1].img}
                title={event[1].description}
                cols = {2}
                rows = {2}
                actionIcon={<IconButton><StarBorder color="white" /></IconButton>}

              >
                <a target="_blank" href={event[1].url}>
                <img src = {event[1].img} />
                </a>
              </GridTile>
            ))}
          </GridList>

        </Card>
      </div>
    )
  }
}


export default EventListCard;
