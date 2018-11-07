import React, { Component } from 'react';
import socketIOClient from "socket.io-client";

class Chat extends React.Component{

	constructor(props){
		super(props);

		this.state = {
			username: '', 
			message: '', 
			messages: []
		};


        // this has to be something other than localhost.

		this.socket = socketIOClient.connect('https://gentle-crag-23071.herokuapp.com', {secure: true});

       

        this.socket.on('RECEIVE_MESSAGE', function(data){
            addMessage(data);
        });


        this.sendMessage = ev =>{
            ev.preventDefault();
            this.socket.emit('SEND_MESSAGE', {
                author: this.state.username,
                message: this.state.message
            });

            this.setState({message: ''});
        }

        const addMessage = data => {
            console.log(data);
            this.setState({messages: [...this.state.messages, data]});
            console.log(this.state.messages);
        };


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

                                {this.state.messages.map(message => {
                                	return(
                                		<div>{message.author}: {message.message}</div>

                                	);
                                })}
                                    
                                </div>
                                
                            </div>
                            <div className="card-footer">
                                    <input type="text" placeholder="Username" value={this.state.username} onChange={ev => this.setState({username: ev.target.value})} className="form-control"/>
                                    <br/>
                                    <input type="text" placeholder="Message"  value={this.state.message} onChange={ev => this.setState({message: ev.target.value})} className="form-control"/>
                                    <br/>
                                    <button onClick={this.sendMessage} className="btn btn-primary form-control">Send</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



		

		);
	}


}

export default Chat;