import React, { Component } from 'react';
import supabase from './supabase';
class Profile extends Component {
    constructor(props){
        super(props);

        this.state = {
            user: null,
            loading: true,
        }


    }
    async componentDidMount(){

        let { data: user, error } = await supabase
        .from('user')
        .select('*')
        console.log(user);

        this.setState({
            loading:false,
            user: user,
        })

    }
    render() {
        return (
            <div>
                <h1>Your Profile</h1>
                {this.state.loading && 
                <div>
                    Loading...
                </div>
                }
                {!this.state.loading && 
                <div>
                    <button onClick={this.props.closeProfile}>X</button>
                    <h2>First Name: {this.state.user[0].first_name}</h2>
                    <h2>Last Name: {this.state.user[0].last_name}</h2>
                    <h2>Email: {this.state.user[0].email}</h2>
                </div>
                }
            </div>
        );
    }
}

export default Profile;
