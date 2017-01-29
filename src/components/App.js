import React from 'react';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import Fish from './Fish';
import sampleFishes from '../sample-fishes';

class App extends React.Component{
	constructor(){
		super();

		this.addFish = this.addFish.bind(this); //binds the addFish 'event' to the component
		this.loadSamples = this.loadSamples.bind(this);
		this.addToOrder = this.addToOrder.bind(this);

		// getinitialState
		this.state = {
			fishes: {},
			order: {}
		};
	}

	addFish(fish){
		// update our state
		const fishes = {...this.state.fishes};//copy existing fishes state into const fishes
		// add in our new fish
		const timestamp = Date.now();
		fishes[`fish-${timestamp}`] = fish;
		// set state
		this.setState({ fishes: fishes});
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
				<Order />
				<Inventory addFish={this.addFish} loadSamples={this.loadSamples} />
			</div>
		)
	}	
}


export default App;