import React from 'react';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import Fish from './Fish';
import sampleFishes from '../sample-fishes';
import base from '../Base'; //firebase db

// video 23

class App extends React.Component{
	constructor(){
		super();

		this.loadSamples = this.loadSamples.bind(this);
		
		this.addFish = this.addFish.bind(this); //binds the addFish 'event' to the App component		
		this.removeFish = this.removeFish.bind(this);
		this.updateFish = this.updateFish.bind(this);
		
		this.addToOrder = this.addToOrder.bind(this);
		this.removeOrder = this.removeOrder.bind(this);

		// getinitialState
		this.state = {
			fishes: {},
			order: {}
		};
	}

	// life cycle methods
	componentWillMount(){
		// this runs right before the <app> is rendered		
		this.ref = base.syncState(`${this.props.params.storeId}/fishes`
			,{
				context:this,
				state: 'fishes'
			});

		// check if there is any order in localStorage
		const localStorageRef = localStorage.getItem(`order-${this.props.params.storeId}`);
		if(localStorage){
			this.setState({
				order: JSON.parse(localStorageRef)
			})
		}
	}

	componentWillUnMount(){
		//this method is from react
		base.removeBinding(this.ref);
	}

	componentWillUpdate(nextProps, nextState){
		//console.log('Something Changed');
		//console.log({nextProps, nextState});
		localStorage.setItem(`order-${this.props.params.storeId}`,
			JSON.stringify(nextState.order));
	}

	shouldComponentUpdate(nextProps, nextState){
		// should we? this will help prevent the double render
		return true;
	}

	// specific component methods
	addFish(fish){
		// update our state
		const fishes = {...this.state.fishes};//copy existing fishes state into const fishes
		// add in our new fish
		const timestamp = Date.now();
		fishes[`fish-${timestamp}`] = fish;
		// set state
		this.setState({ fishes: fishes});
	}

	updateFish(key, updatedFish){
		// to make this method available to the internals of the inventory component
		// you have to add it as a prop in the below on the <Inventory /> element
		// for example <Inventory updateFish={this.updateFish} />
		const fishes = {...this.state.fishes}; // copy of existing
		fishes[key] = updatedFish; // update it
		this.setState({fishes});
	}

	removeFish(key){
		const fishes = {...this.state.fishes};
		fishes[key] = null;
		this.setState({fishes});
	}

	loadSamples(){
		this.setState({
			fishes: sampleFishes
		})
	}

	addToOrder(key){
		// take a copy of our state
		const order = {...this.state.order};
		// update or add the number of fish ordered
		order[key] = order[key] +1 || 1;
		// update oru state
		this.setState({order});
	}

	removeOrder(key){
		const order = {...this.state.order};
		delete order[key];	//can use delete since this is not stored in firebase	
		this.setState({order});
	}


	// main component method
	render(){
		return(
			<div className="catch-of-the-day">
				<div className="menu">
					<Header tagline="Fresh Seafood Market" />
					<ul className="list-of-fish">
						{
							Object
								.keys(this.state.fishes)
								.map(key => <Fish 
									key={key}  
									index={key}
									details={this.state.fishes[key]} 
									addToOrder={this.addToOrder}/>)
						}
					</ul>
				</div>
				<Order 
					fishes={this.state.fishes} 
					order={this.state.order}
					params={this.props.params}
					removeOrder={this.removeOrder}
				/>
				<Inventory 
					addFish={this.addFish} 
					loadSamples={this.loadSamples}
					fishes={this.state.fishes} 
					updateFish={this.updateFish}
					removeFish={this.removeFish} />
			</div>
		)
	}	
}

export default App;