import React from 'react';
import AddFishForm from './AddFishForm';
import base from '../Base';

class Inventory extends React.Component{
	state = {
		uid: null,
		ownder: null
	};

	componentDidMount(){
		// base is the db
		// listen for when we load the page
		base.onAuth((user) => {
			if(user){
				this.authHandler(null, { user });
			}
		})
	}

	handleChange = (e, key) => {
		const fish = this.props.fishes[key];
		// console.log(e.target);
		// take a copy of that fish and update it with the new data
		// ...fish is the js spread func
		// [e.target.name] this is a computed property on updatedFish
		const updatedFish = {
			...fish,
			[e.target.name] : e.target.value
		}
		this.props.updateFish(key, updatedFish);
		//console.log(updatedFish);
	};

	authenticate =(provider) => {
		console.log(`Trying to log in with ${provider}`);
		console.log(base);
		base.authWithOAuthPopup(provider, this.authHandler);
	};

	logout = () => {
		base.unauth();
		this.setState({ uid: null });
	};

	authHandler = (err, authData) => {
		console.log(authData);
		if(err){
			console.error(err);
			return;
		}

		// grab the store info from firebase by store id
		const storeRef = base.database().ref(this.props.storeId);

		// query the firebase once for the store data
		storeRef.once('value', (snapshot) => {
			const data = snapshot.val() || {};

			// claim it as our own if there is no owner already
			if(!data.owner){
				storeRef.set({
					owner: authData.user.uid
				});
			}

			this.setState({
				uid: authData.user.uid,
				owner: data.owner || authData.user.uid
			});
		})
	};

	renderLogin = () => {
		return(
			<nav className="login">
			<h2>Inventory</h2>
			<p>Sign in to manage your store's inventory</p>
			<button className="github" onClick={()=> this.authenticate('github')}>Log in with Github</button>
			<button className="facebook" onClick={()=> this.authenticate('facebook')}>Log in with facebook</button>			
			</nav>
		)
	};

	renderInventory = (key) => {
		const fish = this.props.fishes[key];
		return(
			<div className="fish-edit" key={key}>
				<input type="text" name="name" value={fish.name} placeholder="Fish name" onChange={(e) => this.handleChange(e, key)}/>
				<input type="text" name="price" value={fish.price} placeholder="Fish price" onChange={(e) => this.handleChange(e, key)}/>
				<select type="text" name="status" value={fish.status} placeholder="Fish status" onChange={(e) => this.handleChange(e, key)}>
					<option value="available">Fresh!</option>
					<option value="unavailable">Sold Out!</option>
				</select>
				<textarea type="text" name="desc" value={fish.desc} placeholder="Fish desc" onChange={(e) => this.handleChange(e, key)}></textarea>
				<input type="text" name="image" value={fish.image} placeholder="Fish image" onChange={(e) => this.handleChange(e, key)}/>
				<button onClick={() => this.props.removeFish(key)}>Remove Fish</button>
			</div>
		)
	};
	
	render(){
		const logout = <button onClick={this.logout}>Log Out!</button>;
		// check if a users is not logged in at all
		if(!this.state.uid){
			return <div>{this.renderLogin()}</div>
		}

		// check if the user is the owner of the current store
		if(this.state.uid !== this.state.owner){
			return (
				<div>
					<p>Sorry you are not the owner of this store!</p>
					{logout}
				</div>
			)
		}

		return(
			<div>
				<h2>Inventory</h2>	
				{logout}
				{Object.keys(this.props.fishes).map(this.renderInventory)}	
				<AddFishForm  addFish={this.props.addFish} />	
				<button onClick={this.props.loadSamples}>Load Sample Fishes</button>				
			</div>
		)
	}	

	static propTypes = {
		fishes: React.PropTypes.object.isRequired,
		updateFish: React.PropTypes.func.isRequired,
		removeFish: React.PropTypes.func.isRequired,
		addFish: React.PropTypes.func.isRequired,
		loadSamples: React.PropTypes.func.isRequired,
		storeId: React.PropTypes.string.isRequired
	};
}

export default Inventory;