import React, { Component } from "react";
import { Form, Button, Container } from "react-bootstrap";
import supabase from "./supabase";

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      session: null,
      error: null,
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.createUser = this.createUser.bind(this);
  }

  async onSubmit(event) {
    event.preventDefault();
    console.log(this.state);

    console.log("submitted");
    const { user, session, error } = await supabase.auth.signUp(
      {
        email: this.state.email,
        password: this.state.password,
      },
      { redirectTo: "localhost:3000" }
    );

    if (error) {
      alert(error.message);
    }
    if (user) {
      this.createUser(user);
      alert(`User: ${this.state.email} has been created!`);
    }
    if (session) {
      this.props.passSession(session);
    }
    console.log(error);

    const { data, bucketError } = await supabase.storage.createBucket(
      `${user.id}`,
      { public: true }
    );

    console.log(data);
  }

  onChange(event) {
    console.log(event);
    this.setState({
      [event.target.name]: event.target.value,
    });
  }
  async createUser(user) {
    const { data, error } = await supabase
      .from("user")
      .insert([{ id: user.id, email: user.email }]);
  }

  render() {
    return (
      <Container style={{minWidth: 412}} fluid className='flex-column justify-content-centre align-items-center min-width:'>
        <div>
          <h2 className='text-center'>Signup</h2>
          <Form className='d-flex flex-column' onSubmit={(event) => this.onSubmit(event)}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="email">Email</Form.Label>
              <Form.Control
                placeholder='Type your email'
                name="email"
                value={this.state.email}
                onChange={(event) => this.onChange(event)}
              ></Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="password">Password</Form.Label>
              <Form.Control
              placeholder='Type your password'
                name="password"
                type="password"
                value={this.state.password}
                onChange={(event) => this.onChange(event)}
              ></Form.Control>
            </Form.Group>
            <Button type='submit' className=''>Submit</Button>
            <Button
                className='mt-3'
                variant="secondary"
                size="sm1"
                onClick={() => this.props.closeSignup()}
              >
                Click here to sign in
              </Button>
          </Form>
        </div>
      </Container>
    );
  }
}

export default Signup;
