import React, { Component } from 'react';
import socketIOClient from "socket.io-client";
import axios from 'axios';
import SimpleStorage from "react-simple-storage";

class Chat extends React.Component{

	constructor(props){
		super(props);

		this.state = {
			username: '', 
			message: '',
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

            if(mymessage != 0){

                this.socket.emit('SEND_MESSAGE', {
                    author: this.state.username,
                    message: this.state.message
                });

                this.setState({message: ''});

            }
    
        }

        


        const addMessage = data => {
            console.log(data);

            const these_messages = [...this.state.messages, data];
            this.setState({ messages: these_messages  });

            this.state.chatHistory.push(these_messages);
            localStorage.setItem('these_messages', JSON.stringify(this.state.chatHistory));
            localStorage.setItem('message', "");

        };

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
                                		<div key={key}> {message.author}: {message.message}</div>

                                	);
                                })}
                                     <SimpleStorage parent={this} />
                                </div>
                                
                            </div>
                            <div className="card-footer">
                                    <input type="text" placeholder="Username" value={this.state.username} onChange={ev => this.setState({username: ev.target.value})} className="form-control"/>
                                    <br/>
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