import React, { Component } from 'react';
import socketIOClient from "socket.io-client";
import axios from 'axios';
import Username from './components/Username';
import SimpleStorage from "react-simple-storage";


class Chat extends React.Component{

	constructor(props){
		super(props);

		this.state = {
			username: '', 
			message: '',
			disable: 'show',
			disable2: false,
            intervalIsSet: false,
			messages: [],
            chatHistory: []
		};



        // this has to be something other than localhost.

	   this.socket = socketIOClient.connect('https://gentle-crag-23071.herokuapp.com', {secure: true});




       if(!this.socket){
            this.socket = socketIOClient('localhost:5000');
       }

        this.socket.on('RECEIVE_MESSAGE', function(data){
            addMessage(data);
            
        });


        this.sendMessage = ev =>{
            ev.preventDefault();

            const mymessage = this.state.message

            if(mymessage.length !== 0){

                this.socket.emit('SEND_MESSAGE', {
                    author: this.state.username,
                    message: this.state.message
                });

                this.setState({message: ''});

            }
    
        }
        this.setUsername = ev => {
    	    if (!this.isEnabled()) {
		      ev.preventDefault();
		      return;
		    }
			        
            const username = this.state.username

            this.setState( {
                username: username,
                disable: 'hide',
                disable2: true
            } );


        }


        const addMessage = data => {
            console.log(data);

            const these_messages = [...this.state.messages, data];
            this.setState({ messages: these_messages  });

            this.state.chatHistory.push(these_messages);
            localStorage.setItem('these_messages', JSON.stringify(this.state.chatHistory));
            localStorage.setItem('message', "");

        };


      this.isEnabled = () =>{
	     const { username} = this.state
		    return (
		      username.length > 0 
		    );
	    	
	    }
 

     // end of constructor
    }


 
 

	    hydrateStateWithLocalStorage() {
	        // for all items in state
	        for (let key in this.state) {
	          // if the key exists in localStorage
	          if (localStorage.hasOwnProperty(key)) {
	            // get the key's value from localStorage
	            let value = localStorage.getItem(key);

	            // parse the localStorage string and setState
	            try {
	              value = JSON.parse(value);
	              this.setState({ [key]: value });
	            } catch (e) {
	              // handle empty string
	              this.setState({ [key]: value });
	            }
	          }
	        }
	    }

	    saveStateToLocalStorage() {
	    // for every item in React state
	        for (let key in this.state) {
	          // save to localStorage
	          localStorage.setItem(key, JSON.stringify(this.state[key]));
	        }
	    }

	    componentDidMount() {
	        this.hydrateStateWithLocalStorage();

	        // add event listener to save state to localStorage
	        // when user leaves/refreshes the page
	        window.addEventListener(
	          "beforeunload",
	          this.saveStateToLocalStorage.bind(this)
	        );
	    }

	    componentWillUnmount() {
	        window.removeEventListener(
	          "beforeunload",
	          this.saveStateToLocalStorage.bind(this)
	        );

	        // saves if component has a chance to unmount
	        this.saveStateToLocalStorage();
	    }



		







	render(){

		const isEnab = this.isEnabled();

		return(



			 <div className="chat">
             <h3 className="chat_head">Chat Demo Still Unsure</h3>
                <div className="container">
                    <div className="row">
                        <div className="card">
                            <div className="card-body">
                                
                                <hr/>
                                <div className="messages">

                                {this.state.messages.map((message, key) => {
                                	return(
                                		<div className="chat_text" key={key}> {message.author}: {message.message}</div>

                                	);
                                })}
                                     <SimpleStorage parent={this} />
                                </div>
                                
                            </div>
                            <div className="card-footer">

                                <h6> Set Username</h6>

								<form onSubmit={this.setUsername}>
									<input type="text"
									placeholder="Username"
									value={this.state.username}
									disabled = {this.state.disable2}
									onChange={ev => this.setState({username: ev.target.value})}
									className="form-control"/>
									<button id={this.state.disable} disabled={!isEnab} className="btn btn-primary btn-sm mt-3">Set</button>
								</form>
                           
                      

                             

                            </div>

                            <div className="card-footer">
                            

                                    <input type="text" placeholder="Message" required value={this.state.message} onChange={ev => this.setState({message: ev.target.value})} className="form-control"/>
                                    <br/>
                                    <button  onClick={this.sendMessage} className="btn btn-primary form-control">Send</button>
                            </div>

                            
                        </div>
                    </div>
                </div>
            </div>



		

		);
	}


}

export default Chat;