import React, { Component } from 'react';
import supabase from './supabase';

class Signup extends Component {
    constructor(props){
        super(props)

        this.state = {
            email: '',
            password: '',
            session: null,
            error: null,
        }

        this.onSubmit = this.onSubmit.bind(this)
        this.onChange = this.onChange.bind(this)
    }
    
  
   
    async onSubmit(event){
        

        event.preventDefault();
        console.log(this.state);


        console.log('submitted');
        const { user, session, error } = await supabase.auth.signUp({
            email: this.state.email,
            password: this.state.password,
          },{redirectTo: 'localhost:3000'})


          console.log(session);
          if(error){
              alert(error.message)
          }
          console.log(error);

        
          
    }

    onChange(event){

        console.log(event);
        this.setState({
            [event.target.name]: event.target.value,
        })
    }

    render() {
        return (
           
                <div>
                    <h1>Signup here</h1>
                    <form onSubmit={event => this.onSubmit(event)}>
                        <label htmlfor='email'>Email</label>
                        <input name='email' value={this.state.email} onChange={event => this.onChange(event)}></input>
                        <label htmlfor='password'>Password</label>
                        <input name='password' type='password' value={this.state.password} onChange={event => this.onChange(event)}></input>
                        <button>Submit</button>
                    </form>
                </div>
            
            
        );
    }
}

export default Signup;
