import React from 'react';
import { getFunName } from '../helpers';

class StorePicker extends React.Component{
	// constructor(){
	// 	super();
	// 	this.goToStore = this.goToStore.bind(this);//how do you bind a unbound method inside a component?
	// }

	//state, props and context

	goToStore(event){
		//inside a unbound method you cannot use 'this'. 'this' should equal StorePicker
		event.preventDefault();//prevents the default page refresh		
		//first grab the text from the box		
		const storeId = this.storeInput.value;
		console.log(storeId);
		//second we are going to transition from / to /store/:storeId
		this.context.router.transitionTo(`/store/${storeId}`);// this function comes from he React.PropTypes.object below
	}

	render(){
		// render is bound to the component. meaning this inside of the component gives you access to StorePicker members
		return(
			<form  className="store-selector" onSubmit={this.goToStore.bind(this)}>
				{/* JSX comments*/}
				<h2>Please Enter A Store</h2>
				<input type="text" required placeholder="Store Name" 
					defaultValue={getFunName()} ref={(input)=>{this.storeInput = input}}/>
				<button type="submit">Visit Store -></button>
			</form>
		)
	}	
}

StorePicker.contextTypes={
	router: React.PropTypes.object
}

export default StorePicker;