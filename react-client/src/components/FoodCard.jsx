import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import DatePicker from 'material-ui/DatePicker';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import MapsLocalDining from 'material-ui/svg-icons/maps/local-dining';
import Divider from 'material-ui/Divider';
import {
  red500, grey500
} from 'material-ui/styles/colors';

const styles = {
  cardHeader: {
    height: '20%',
  },
  list: {
    width: '100%',
    height: '75%',
    overflowY: 'auto',
  },
  card: {
    width: '100%',
    height: 400,
  },
  avatar: {
    backgroundColor: red500,
  },
  star: {
    height: '48px',
    width: '48px',
    position: 'absolute',
    top: '0px',
    right: '0px',
    marginRight: '0px'
  },
  hyperlink: {
    textDecoration: 'none',
    color: 'inherit'
  }
};

class FoodCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      primary: '',
      secondary: '',
      url: '',
    };
  }

  addToItinerary(name, address, url) {
    this.refs.dp.openDialog();
    this.setState({
      primary: name,
      secondary: address,
      url: url,
    });
  }

  render() {
    return (
      <div>
        <Card style={styles.card}>
          <CardHeader
            title="Food"
            subtitle={this.props.food.length + ' restaurants nearby'}
            avatar={<Avatar
              icon={<MapsLocalDining />}
              style={styles.avatar}
            />}
            style={styles.cardHeader}
          />
          <Divider/>
          <List
            style={styles.list}
          >
            {this.props.food.map((restaurant) => (
              <ListItem
                key={restaurant.place_id}
                leftAvatar={<Avatar src={restaurant.photo} />}
                primaryText={
                  <p>
                    <a target="_blank" href={restaurant.url} style={styles.hyperlink}>
                      {restaurant.name}
                    </a>
                  </p>
                }
                secondaryText={
                  <p>
                    <a target="_blank" href={restaurant.url} style={styles.hyperlink}>
                      <span>Rating: {restaurant.rating}</span><br/>
                      <span>{restaurant.formatted_address}</span>
                    </a>
                  </p>
                }
                secondaryTextLines={2}
                rightIcon={
                  <IconButton
                    style={styles.star}
                    onTouchTap={() => { this.addToItinerary(restaurant.name, restaurant.formatted_address, restaurant.url); }}
                  >
                    <StarBorder color={grey500} />
                  </IconButton>}
              />
            ))}
            <DatePicker
              ref="dp"
              onChange={(nullVal, date) => {
                let context = this;
                this.props.submitToItinerary(date, context.state.primary, context.state.secondary, context.state.url, 'food');
                this.setState({
                  showDatePicker: false
                });
              }}
              style={{display: 'none'}}
            />
          </List>
        </Card>
      </div>
    );
  }
}


export default FoodCard;