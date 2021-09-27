import React, { Component } from "react";
import supabase from "./supabase";
import ViewJobs from "./ViewJobs";
import Signup from "./Signup";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      signedIn: false,
      signup: false,
      session: null,
      error: null,
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  async onSubmit(event) {
    event.preventDefault();

    const { user, session, error } = await supabase.auth.signIn({
      email: this.state.email,
      password: this.state.password,
    });

    if (user && session) {
      this.setState(
        {
          email: "",
          password: "",
          session: session,
          signedIn: true,
          error: null,
        },
        () => {
          console.log(this.state);
        }
      );
    }

    if (error) {
      this.setState({
        error: error.message,
      });
    }
  }

  onChange(event) {
    console.log(event);
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  render() {
    return (
      
        <div>
            <h1>Sprayaway Web App</h1>
          {!this.state.signup && !this.state.session && (
            <div>
              <h2>Sign In here</h2>
              <h2>
                Or if you dont have an account click{" "}
                <a href='#' onClick={() => this.setState({signup: true})}>here</a> to sign up
              </h2>
              <form onSubmit={(event) => this.onSubmit(event)}>
                <label htmlFor="email">Email</label>
                <input
                  name="email"
                  value={this.state.email}
                  onChange={(event) => this.onChange(event)}
                ></input>
                <label htmlFor="password">Password</label>
                <input
                  name="password"
                  type="password"
                  value={this.state.password}
                  onChange={(event) => this.onChange(event)}
                ></input>
                <button>Submit</button>
              </form>
            </div>
          )}
          {this.state.session && (
            <div>
              <h2>Signed in as {this.state.session.user.email}</h2>
              <button onClick={() => this.setState({ session: null })}>
                Sign Out
              </button>
            </div>
          )}
          {!this.state.signup && this.state.error && (
            <div>
              <h2>{this.state.error}</h2>
            </div>
          )}
          {this.state.session && (
            <div>
              <ViewJobs session={this.state.session} />
            </div>
          )}
          {this.state.signup &&
          <div>
              <Signup/>
              <button onClick={() => this.setState({signup: false})}>Click here to sign in</button>
          </div>
          }
        </div>
       
    );
  }
}
