import React, { Component } from "react";
import supabase from "./supabase";
import { Button, Form, Spinner, Card } from "react-bootstrap";
class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      loading: true,
      editing: false,
      authuser: null,
      first_name: null,
      last_name: null,
      number: null,
      street: null,
      postcode: null,
      city: null,
      county: null,
    };
    

    this.editProfile = this.editProfile.bind(this);
    this.showProfile = this.showProfile.bind(this);
    this.saveProfile = this.saveProfile.bind(this);
    this.onChange = this.onChange.bind(this);
  }
  async componentDidMount() {
    this.setState(
      {
        authuser: this.props.session.user,
      },
      () => {
        this.showProfile(this.state.authuser);
        console.log(this.state.authuser);
      }
    );
  }

  async editProfile() {
      this.showProfile(this.state.authuser)
    this.setState({
      editing: !this.state.editing,
    });

  }
  async showProfile(currentUser) {
    let { id } = currentUser;
    console.log(id);
    let { data: users, error } = await supabase.from("user").select("*");
    console.log(users);

    users.forEach((user) => {
      if (user.id === id) {
        this.setState(
          {
            user: user,
            loading: false,
            first_name: user.first_name,
            last_name: user.last_name,
            number: user.number,
            postcode: user.postcode,
          },
          () => {
            console.log(this.state.user);
          }
        );
      }
    });
  }

  async saveProfile(event ) {
    event.preventDefault();
    console.log('submit called');
    console.log(event);
    let user = this.state.user
    user.first_name = event.target[0].value
    user.last_name = event.target[1].value
    user.number = event.target[2].value
    user.street = event.target[3].value
    user.city = event.target[4].value
    user.county = event.target[5].value
    user.postcode = event.target[6].value
    this.setState({
        editing: false,
    })

        
    const { data, error } = await supabase
        .from('user')
        .update({ 
            first_name: event.target[0].value,
            last_name:event.target[1].value,
            email: `${this.state.user.email}`,
            number: Number(event.target[2].value),
            street: event.target[3].value,
            city: event.target[4].value,
            county: event.target[5].value,
            postcode: event.target[6].value})
        .eq(`id`, `${this.state.authuser.id}`)

  }
  onChange(event) {
    console.log(event.target);
    this.setState(
      {
        user: { ...this.state.user, [event.target.name]: event.target.value },
      },
      () => {
        console.log(this.state.user);
      }
    );
  }
  render() {
    return (
      <div className='d-flex flex-column align-items-center text-center'>
          <Button style={{position: 'absolute', top: 10, right: 10, width: 'fit-content'}} onClick={this.props.closeProfile}>X</Button>
        
        
        {this.state.loading && <Spinner className='my-3' animation='border'></Spinner>}
        {!this.state.editing && !this.state.loading && (
          <Card className='text-center d-flex flex-column '>
            <Card.Title className='text-center'>Your Profile</Card.Title>
            <Card.Text>First Name: {this.state.user.first_name}</Card.Text>
            <Card.Text>Last Name: {this.state.user.last_name}</Card.Text>
            <Card.Text>Email: {this.state.user.email}</Card.Text>
            <Card.Text>Phone Number: {this.state.user.number}</Card.Text>
            <Card.Text>Street Name: {this.state.user.street}</Card.Text>
            <Card.Text>City: {this.state.user.city}</Card.Text>
            <Card.Text>County: {this.state.user.county}</Card.Text>
            <Card.Text>Postcode: {this.state.user.postcode}</Card.Text>
            <Button onClick={this.editProfile}>Edit Profile</Button>
          </Card>
        )}
        {this.state.editing && (
          <div>
            <Form onSubmit={event => this.saveProfile(event)} className="mb-3">
              <Form.Group>
                <Form.Label>First Name: </Form.Label>
                <Form.Control
                  value={this.state.user.first_name}
                  onChange={(event) => this.onChange(event)}
                  name="first_name"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Last Name: </Form.Label>
                <Form.Control
                    value={this.state.user.last_name}
                  onChange={(event) => this.onChange(event)}
                  name="last_name"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Number: </Form.Label>
                <Form.Control
                value={this.state.user.number}
                  onChange={(event) => this.onChange(event)}
                  name="number"
                  type='number'
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Street Name: </Form.Label>
                <Form.Control
                value={this.state.user.street}
                  onChange={(event) => this.onChange(event)}
                  name="street"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>City: </Form.Label>
                <Form.Control
                value={this.state.user.city}
                  onChange={(event) => this.onChange(event)}
                  name="city"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>County: </Form.Label>
                <Form.Control
                value={this.state.user.county}
                  onChange={(event) => this.onChange(event)}
                  name="county"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Postcode: </Form.Label>
                <Form.Control
                value={this.state.user.postcode}
                  onChange={(event) => this.onChange(event)}
                  name="postcode"
                />
              </Form.Group>
              <Button type='submit'>Save Profile</Button>
            </Form>
            <Button onClick={this.editProfile}>Close without saving</Button>
          </div>
        )}
        
      </div>
    );
  }
}

export default Profile;
