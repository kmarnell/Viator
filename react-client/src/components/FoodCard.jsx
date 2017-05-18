import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
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
  }
};

class FoodCard extends React.Component {
  constructor(props) {
    super(props);
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
                primaryText={restaurant.name}
                secondaryText={
                  <p>
                  <span>Rating: {restaurant.rating}</span><br/>
                  <span>{restaurant.formatted_address}</span>
                  </p>
                }
                secondaryTextLines={2}
                rightIcon={
                  <IconButton style={styles.star}>
                    <StarBorder color={grey500} />
                  </IconButton>}
                target="_blank"
                href={restaurant.url}
              />
            ))}
          </List>
        </Card>
      </div>
    );
  }
}


export default FoodCard;