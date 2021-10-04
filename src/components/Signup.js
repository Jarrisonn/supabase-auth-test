import React, { Component } from 'react';
import supabase from './supabase';

class Signup extends Component {
    constructor(props) {
        super(props)

        this.state = {
            email: '',
            password: '',
            session: null,
            error: null,
        }

        this.onSubmit = this.onSubmit.bind(this)
        this.onChange = this.onChange.bind(this)
        this.createUser = this.createUser.bind(this)
    }



    async onSubmit(event) {


        event.preventDefault();
        console.log(this.state);


        console.log('submitted');
        const { user, session, error } = await supabase.auth.signUp({
            email: this.state.email,
            password: this.state.password,
        }, { redirectTo: 'localhost:3000' })




        if (error) {
            alert(error.message)
        }
        if (user) {
            this.createUser(user)
            alert(`User: ${this.state.email} has been created!`)
        }
        if (session) {
            this.props.passSession(session);
        }
        console.log(error);

        const { data, bucketError } = await supabase
            .storage
            .createBucket(`${user.id}`, { public: true })

            console.log(data);



    }

    onChange(event) {

        console.log(event);
        this.setState({
            [event.target.name]: event.target.value,
        })
    }
    async createUser(user) {

        const { data, error } = await supabase
            .from('user')
            .insert([
                { id: user.id, email: user.email, },
            ])

    }

    render() {
        return (

            <div>
                <h1>Signup here</h1>
                <form onSubmit={event => this.onSubmit(event)}>
                    <label htmlFor='email'>Email</label>
                    <input name='email' value={this.state.email} onChange={event => this.onChange(event)}></input>
                    <label htmlFor='password'>Password</label>
                    <input name='password' type='password' value={this.state.password} onChange={event => this.onChange(event)}></input>
                    <button>Submit</button>
                </form>
            </div>


        );
    }
}

export default Signup;
