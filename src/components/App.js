import React, { Component } from "react";
import supabase from "./supabase";
import ViewJobs from "./ViewJobs";
import Signup from "./Signup";
import Profile from "./Profile";
import '../styles/App.css'

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
      profile:false,
      invoice: false,
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.passSession = this.passSession.bind(this);
    this.showProfile = this.showProfile.bind(this)
    this.closeProfile = this.closeProfile.bind(this);
    this.showInvoice = this.showInvoice.bind(this)
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

  passSession(session){
    console.log(session);
    this.setState({
      session: session,
      signup: false,
      signedIn: true,
    },() => {
      console.log(this.state.session);
    })
  }
  showProfile(){
    this.setState({
      profile: true
    })
  }
  closeProfile(){
    this.setState({
      profile: false
    })
  }
  showInvoice(){
    this.setState({
      invoice: !this.state.invoice,
    })
  }
  render() {
    return (
      
        <div>
            <h1>Sprayaway</h1>
          {!this.state.signup && !this.state.session && (
            <div>
              <h2>Sign In here</h2>
              <h2>
                Or if you dont have an account click{" "}
                <button onClick={() => this.setState({signup: true})}>here</button> to sign up
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
          {!this.state.invoice && this.state.session && (
            <div>
              <h2>Signed in as {this.state.session.user.email}</h2>
              <button onClick={() => this.setState({ session: null,signedIn: false, profile: false, })}>
                Sign Out
              </button>
            </div>
          )}
          {!this.state.signup && this.state.error && (
            <div>
              <h2>{this.state.error}</h2>
            </div>
          )}
          {this.state.session && !this.state.profile && (
            <div>
              <ViewJobs showInvoice={this.showInvoice} session={this.state.session} />
              
              {!this.state.invoice && <button onClick={this.showProfile}>Show Profile</button>}
            </div>
          )}
          {this.state.signup &&
          <div>
              <Signup passSession={this.passSession}/>
              <button onClick={() => this.setState({signup: false})}>Click here to sign in</button>
          </div>
          }
          {this.state.profile && this.state.session &&
          <div>
            <Profile closeProfile={this.closeProfile}/>
          </div>}
          
        </div>
       
    );
  }
}
