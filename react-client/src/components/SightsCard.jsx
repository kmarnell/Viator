import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import Star from 'material-ui/svg-icons/toggle/star';
import MapsPlace from 'material-ui/svg-icons/maps/place';
import Avatar from 'material-ui/Avatar';
import DatePicker from 'material-ui/DatePicker';
import {
  grey500, blueGrey500
} from 'material-ui/styles/colors';
import Divider from 'material-ui/Divider';

const styles = {
  cardHeader: {
    height: '20%',
  },
  gridList: {
    width: '100%',
    height: '80%',
    overflowY: 'auto',
  },
  card: {
    width: '100%',
    height: 400,
  },
  avatar: {
    backgroundColor: blueGrey500,
  }
};
  

class SightsCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      primary: '',
      secondary: '',
      url: ''
    };

    this.addToItinerary = this.addToItinerary.bind(this);
  }

  addToItinerary(name, address, url) {
    this.refs.dp.openDialog();
    this.setState({
      primary: name,
      secondary: address,
      url: url
    });
  }

  render() {

    return (
      <div>
        <Card
          style={styles.card}
        >
          <CardHeader
            title="Places of Interest"
            subtitle={this.props.sights.length + ' attractions nearby'}
            avatar={<Avatar icon={<MapsPlace />} style={styles.avatar} />}
            style={styles.cardHeader}
          />
          <Divider/>
          <GridList
            cellHeight={180}
            style={styles.gridList}
          >
            {this.props.sights.map((sight) => (
              <GridTile
                key={sight.place_id}
                title={sight.name}
                subtitle={<b>{sight.formatted_address}</b>}
                actionIcon={
                    <IconButton onTouchTap={() => { this.addToItinerary(sight.name, sight.formatted_address, sight.url); }}>
                      <StarBorder color="white" />
                    </IconButton>
                }
              >
                <a target="_blank" href={sight.url}>
                <img src={sight.img} />
                </a>
                <DatePicker
                  ref="dp"
                  onChange={(nullVal, date) => {
                    let context = this;
                    this.props.submitToItinerary(date, context.state.primary, context.state.secondary, context.state.url, 'sight');
                  }}
                />
              </GridTile>
            ))}
          </GridList>
        </Card>
      </div>
    );
  }
}

export default SightsCard;
