import React, { Component } from "react";
import supabase from "./supabase";
import ViewJobs from "./ViewJobs";
import Signup from "./Signup";
import Profile from "./Profile";
import { Button, Container, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ImProfile } from "react-icons/im";

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
      profile: false,
      invoice: false,
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.passSession = this.passSession.bind(this);
    this.showProfile = this.showProfile.bind(this);
    this.closeProfile = this.closeProfile.bind(this);
    this.showInvoice = this.showInvoice.bind(this);
    this.closeSignup = this.closeSignup.bind(this);
  }

  async onSubmit(event) {
    event.preventDefault();

    console.log("submitted");
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

  passSession(session) {
    console.log(session);
    this.setState(
      {
        session: session,
        signup: false,
        signedIn: true,
      },
      () => {
        console.log(this.state.session);
      }
    );
  }
  showProfile() {
    this.setState({
      profile: true,
    });
  }
  closeProfile() {
    this.setState({
      profile: false,
    });
  }
  showInvoice() {
    this.setState({
      invoice: !this.state.invoice,
    });
  }

  closeSignup() {
    console.log("close");
    this.setState({
      signup: false,
    });
  }
  render() {
    return (
      <Container
        fluid
        className="d-flex vh-100 flex-column justify-content-centre align-items-center"
        style={{ position: "relative" }}
      >
        <div>
          <h1 className="text-center mb-3 fw-bold">Sprayaway</h1>
          {!this.state.signup && !this.state.session && (
            <div>
              <h2 className="text-center">Sign In</h2>
              <Form
                className="d-flex flex-column"
                onSubmit={(event) => this.onSubmit(event)}
              >
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="email">Email</Form.Label>
                  <Form.Control
                    placeholder="Type your email"
                    type="email"
                    name="email"
                    value={this.state.email}
                    onChange={(event) => this.onChange(event)}
                  ></Form.Control>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="password">Password</Form.Label>
                  <Form.Control
                    placeholder="Type your password"
                    name="password"
                    type="password"
                    value={this.state.password}
                    onChange={(event) => this.onChange(event)}
                  ></Form.Control>
                </Form.Group>
                <Button type="submit">Submit</Button>
              </Form>
              <p className="mt-3">
                Or if you dont have an account click{" "}
                <Button
                  variant="secondary"
                  size="sm1"
                  onClick={() => this.setState({ signup: true })}
                >
                  here
                </Button>{" "}
                to sign up
              </p>
            </div>
          )}
          {!this.state.invoice && this.state.session && (
            <div>
              <h2 className='text-center'>Signed in as {this.state.session.user.email}</h2>
              <Button
                style={{ position: "absolute", top: 10, left: 10 }}
                onClick={() =>
                  this.setState({
                    session: null,
                    signedIn: false,
                    profile: false,
                  })
                }
              >
                Sign Out
              </Button>
            </div>
          )}
          {!this.state.signup && this.state.error && (
            <div>
              <h2>{this.state.error}</h2>
            </div>
          )}
          {this.state.session && !this.state.profile && (
            <div>
              <ViewJobs
                showInvoice={this.showInvoice}
                session={this.state.session}
              />

              {!this.state.invoice && (
                <ImProfile
                  className="text-primary"
                  style={{
                    cursor: "pointer",
                    position: "absolute",
                    top: 10,
                    right: 10,
                    height: 50,
                    width: 50,
                  }}
                  onClick={this.showProfile}
                />
              )}
            </div>
          )}
          {this.state.signup && (
            <div>
              <Signup
                closeSignup={this.closeSignup}
                passSession={this.passSession}
              />
            </div>
          )}
          {this.state.profile && this.state.session && (
            <div>
              <Profile session={this.state.session} closeProfile={this.closeProfile} />
            </div>
          )}
        </div>
      </Container>
    );
  }
}
