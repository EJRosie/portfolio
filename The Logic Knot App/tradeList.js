import React from 'react';
import { Button, Modal, TouchableOpacity, FlatList, ActivityIndicator, Text, View  } from 'react-native';
import styles from '../styles.js';
import { PUBLIC_KEY, PRIVATE_KEY, ACCESS_TOKEN } from '../partials/TCGPlayer.js';
import { connect } from 'react-redux';
import {reducer} from '../redux/reducers.js';
import {addCard, deleteCard, changePrice} from '../redux/actions.js';
import axios from 'react-native-axios';
import TradeSearch from './TradeSearch.js';

class TradeList extends React.Component {

constructor(props){
    super(props);
    this.state ={ 
      cardList: null,
      token: "",
      modal: false,
    }
  }

  componentDidMount(){
  	this.setState({token: this.props.token});
  }


	/* * * * * * * * * * * * * * * * * * * * * * * * *
	 * * * * * * Render & Render Functions * * * * * *
	 * * * * * * * * * * * * * * * * * * * * * * * * */

  render(){

    return(
      <View style={styles.tradeList}>

	      <Modal
	        animationType={"fade"}
	        visible={this.state.modal}
	        style={styles.tradeModal}
	      >
	      	<View style={styles.tradeModalContainer}>
	        	<TradeSearch add={this.addCard.bind(this)}/>
	          <Button
	            onPress={() => {this.setState({modal: false})}}
	            title="Cancel"
	            color= '#000'
	            style={styles.tradeCancelButton}
	          />
	        </View>
	      </Modal>


	      <Text> {this.props.side}</Text>
	      <FlatList
	      	style={styles.tradingList}
				  data={this.props.cardList}
				  keyExtractor={(item, index) => index.toString()}
				  renderItem={({item}) => this.renderCardUnit(item)}
				  ListFooterComponent={
				  	<TouchableOpacity style={styles.addCardButton} onPress={this.openModal.bind(this)}>
	      			<Text style={styles.addCardText}> + </Text>
	      		</TouchableOpacity>
	      	}
				/>
      </View>
    );

  }

	/* Render Related Functions */

	openModal() {
		this.setState({modal: true});
	}

	renderCardUnit(item) {
		return (
			<Text> {item.name} {item.price} </Text>
		);
	}


	/* * * * * * * * * * * * * * * * * * * * * * * * *
	 * * * * * End Render & Render Functions * * * * * 
	 * * * * * * * * * * * * * * * * * * * * * * * * */



	//Close the modal, and add the card in.
  addCard(cardName, setName) {
  	this.setState({modal: !this.state.modal});
  	this.getCardID(this.state.token, cardName, setName);
  }

  //Using a card name and set name, get the ID of the card, and then use it to fetch the price.
	getCardID(accessToken, cardName, setName) {
		fetchString = "http://api.tcgplayer.com/catalog/products?categoryId=1&groupName=" + setName + "&productName=" + cardName;
		return axios.get(fetchString, 
				{ headers: { Authorization: "bearer " + accessToken } }
			).then((response) => {

				id = response.data.results[0].productConditions[0].productConditionId;
				console.log(cardName + " ID: " + id);
				this.getMarketPrice(accessToken, id, cardName, setName);

	  	}).catch((error) =>{
	      console.log("Error fetching cardID");
	      this.props.dispatchAddCard(this.props.side, -1, cardName, 0.00, setName);
	    });
	}

	//Get the Market Price of a card, and dispatch it to the store.
	getMarketPrice(accessToken, cardID, cardName, setName) {
		return axios.get("http://api.tcgplayer.com/pricing/marketprices/" + cardID,
				{ headers: { Authorization: "bearer " + accessToken } }
			).then((response) => {

				price = response.data.results[0].price;
			  console.log("Price: $" + price);
			  this.props.dispatchAddCard(this.props.side, cardID, cardName, price, setName);

			}).catch((error) =>{
				console.log("Error fetching card price");
        this.props.dispatchAddCard(this.props.side, cardID, cardName, 0.00, setName);
      });
	}


}



/* * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * Redux Functions * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * */

//Map the correct 'side' of cards to the trade list.
function mapStateToProps(state, ownProps) {
	if(ownProps.side == 'Left') {
	  return {
	  	side: 'Left',
	    cardList: state.leftCards
	  };
	}
	else {
		return {
			side: 'Right',
	    cardList: state.rightCards
	  };
	}
}

//Add in addCard to the component
function mapDispatchToProps(dispatch) {
  return {
    dispatchAddCard: (side, id, name, price, set) => dispatch(addCard(side, id, name, price, set)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TradeList);
