require('es6-promise').polyfill();

import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';

class ChatInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chatValue: ''
    }

    this.handleChatValueChange = this.handleChatValueChange.bind(this);
    this.handleSubmitChat = this.handleSubmitChat.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleChatValueChange(ev) {
    this.setState({
      chatValue: ev.target.value
    });
  }

  makeServerCall(cb) {
    var callConfiguration = { message: this.state.chatValue };
    
    callConfiguration.method = 'POST';


    return (
      fetch('//localhost:5000/', callConfiguration)
        .then(response => {
          if (response.status >= 400) {
            this.setState({
              chatValue: 'No bro\'s available bro',
            });
            throw new Error('No bro\'s available bro');
          }

          return response.text();
        })
        .then(cb)
        .catch(() => {
          this.setState({
            chatValue: 'No bro\'s available bro'
          })
        })
    );
  }

  handleSubmitChat() {

    this.makeServerCall(message => {
      this.props.addMessage(this.state.chatValue, 'You', new Date())
    });

    this.setState({
      chatValue: ''
    })
  }

  handleKeyPress(ev) {
    if (ev.key === 'Enter') {
      this.handleSubmitChat();
    }
  }

  render() {
    return (
      <div className="input-group">
        <input type="text" className="form-control" aria-label="Chat input box" value={this.state.chatValue} onChange={this.handleChatValueChange} onKeyPress={this.handleKeyPress} />
        <div className="input-group-btn">
          <button type="button" className="btn btn-success" onClick={this.handleSubmitChat}><i className="glyphicon glyphicon-comment" /></button>
        </div>
      </div>
    );
  }
}

export default ChatInput;