import React, { Component } from 'react';
import {Button, List, Image, Input,  Container, Segment} from "semantic-ui-react";
import { Link } from 'react-router-dom';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import 'normalize.css';
import axios from 'axios'
import PropTypes from 'prop-types';
import styles from './Detail.scss';
import { Redirect } from 'react-router'
import { withRouter } from 'react-router'


class Detail extends Component {
	constructor(props) {
	    super(props);
	    this.state = {
	      characters: {},
	      id:this.props.match.params.id,
	      path:" ",
	      ex:" ",
	      url:' ',
          change:this.props.match.params.id,
          description:'',
          error:false,
	    };
	
	    this.public_key = '2f5e26fcc035d8014d57fece2897cba7';
    	var private_key = 'eaa5cfc4f3318b6176607cc731eeb694d5454718';
    	this.ts = Date.now();
    	var msg = `${this.ts}${private_key}${this.public_key}`;
    	var md5 = require('md5');
    	this.hash = md5(msg);

    	this.baseUrl = 'https://gateway.marvel.com:443/v1/public/characters/';
    	var url = `${this.baseUrl}${this.state.id}?apikey=${this.public_key}&ts=${this.ts}&hash=${this.hash}`;

    	this.nextHandler = this.nextHandler.bind(this);
    	this.prevHandler = this.prevHandler.bind(this);
    	  
    	// GET some data back!
    	axios.get(url).then((response) => {
    		console.log(this.state.id);
    	   	this.setState({characters:response.data.data.results[0]});
    	   	this.setState({path:response.data.data.results[0].thumbnail.path});
    	   	this.setState({
                ex:response.data.data.results[0].thumbnail.extension,
                description: response.data.data.results[0].description
            });
    	   	var url = `${this.state.path}.${this.state.ex}`;
    	   	this.setState({url:url});
    	   	console.log(url);
    	}).catch((error) => {
    	    console.log(error);
            console.log("invalid id");
            var new_id = String(Number(this.state.id)+1);
            this.setState({error:true});

            // this.props.router.push(/char/+new_id);
            // this.nextHandler();


    	});
    	
    }

	nextHandler() {
		console.log("next");
		var new_id = String(Number(this.state.id)+1);
        this.setState({
            id:new_id,
            error: false
        });
        var url = `${this.baseUrl}${new_id}?apikey=${this.public_key}&ts=${this.ts}&hash=${this.hash}`;

        // GET some data back!
        axios.get(url).then((response) => {
            console.log(response.data.data.results[0]);
            this.setState({characters:response.data.data.results[0]});
            this.setState({path:response.data.data.results[0].thumbnail.path});
            this.setState({
                ex:response.data.data.results[0].thumbnail.extension,
                description: response.data.data.results[0].description
            });
            var url = `${this.state.path}.${this.state.ex}`;
            console.log(url);
            this.setState({url:url, change:this.state.id});

        }).catch((error) => {
            console.log("invalid id");
            console.log(error);
            this.setState({error:true});
        });

	}

	prevHandler() {
        console.log("prev clicked");

		var new_id = String(Number(this.state.id)-1);
        this.setState({
            id:new_id,
            error: false

        });
        var url = `${this.baseUrl}${new_id}?apikey=${this.public_key}&ts=${this.ts}&hash=${this.hash}`;

        // GET some data back!
        axios.get(url).then((response) => {
            console.log(response.data.data.results[0]);
            this.setState({characters:response.data.data.results[0]});
            this.setState({path:response.data.data.results[0].thumbnail.path});
            this.setState({
                ex:response.data.data.results[0].thumbnail.extension,
                description: response.data.data.results[0].description
            });
            var url = `${this.state.path}.${this.state.ex}`;
            this.setState({url:url, change:this.state.id});

            console.log(url);

        }).catch((error) => {
            console.log("invalid id");
            console.log(error);
            this.setState({error:true});
        });
	}

	render() {
		// var url = `${this.state.characters.thumbnail.path}.${this.state.characters.thumbnail.extension}`;
        var prev_id = String(Number(this.state.id)-1);
        var next_id = String(Number(this.state.id)+1);
        var cur_id = this.state.id;
        console.log("render  "+this.props.match.params.id);
        if (this.state.error === true){
            return (
                <div>
                    <div className="navbar" id="navbar">
                        <h1 className='header'>Marvel</h1>
                    </div>
                    <div className="menu">
                        <a id="search" href="/">Search</a>
                        <a id="gallery" href="/gallery">Gallery</a>
                    </div>
                    <Segment className="char-card">
                        <Link to={'/char/'+ prev_id} onClick={this.prevHandler}><span className="prev" id="prev">&#10094;</span></Link>
                        <Link to={'/char/'+ next_id} onClick={this.nextHandler}><span className="next" id="next">&#10095;</span></Link>
                        <h1>Invalid character ID, please click next or prev.</h1>
                    </Segment>
                    
                </div>
            );

        }
        else if (this.state.id === this.state.change){
            return (
                <div>
                    <div className="navbar" id="navbar">
                        <h1 className='header'>Marvel</h1>
                    </div>
                    <div className="menu">
                        <a id="search" href="/">Search</a>
                        <a id="gallery" href="/gallery">Gallery</a>
                    </div>
                    <Segment className="char-card">
                        <Image src={this.state.url} size='medium' centered />
                        <Link to={'/char/'+ prev_id} onClick={this.prevHandler}><span className="prev" id="prev">&#10094;</span></Link>
                        <Link to={'/char/'+ next_id} onClick={this.nextHandler}><span className="next" id="next">&#10095;</span></Link>
                        <h1>{this.state.characters.name}</h1>
                        <h5>ID: {this.state.id}</h5>
                        <h5>Description: {this.state.description}</h5>
                    </Segment>
                    
                </div>
            );
        }
        else{
            return (
                <div>
                    <div className="navbar" id="navbar">
                        <h1 className='header'>Marvel</h1>
                    </div>
                    <div className="menu">
                        <a id="search" href="/">Search</a>
                        <a id="gallery" href="/gallery">Gallery</a>
                    </div>
                    <Segment className="char-card">
                        <Link to={'/char/'+ prev_id} onClick={this.prevHandler}><span className="prev" id="prev">&#10094;</span></Link>
                        <Link to={'/char/'+ next_id} onClick={this.nextHandler}><span className="next" id="next">&#10095;</span></Link>
                        <h1>Loading</h1>
                    </Segment>
                    
                </div>
            );

        }
    	
  	}
}


export default Detail