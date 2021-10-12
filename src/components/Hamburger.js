import React, { Component } from "react";
import { Nav } from "react-bootstrap";
import "../styles/hamburger.css";
import Profile from "./Profile";
class Hamburger extends Component {
  constructor(props) {
    super(props);

    this.openProfile = this.openProfile.bind(this);
    this.addJob = this.addJob.bind(this);
  }
  componentDidMount() {
    console.log(this.props);
    console.log('Hamburger Mounted');
    this.props.closeProfile();
  }
  addJob() {
    this.props.getAddJob();
    
    this.props.closeMenu();
  }
  openProfile() {
    this.props.showProfile();
    this.props.closeMenu();
  }
  render() {
    return (
      <div>
        <Nav
          style={{ height: "100vh" }}
          defaultActiveKey="/home"
          className="flex-column"
        >
          <Nav.Link href={`#`}>Sign Out</Nav.Link>
          <Nav.Link onClick={this.openProfile} eventKey="link-1">
            Profile
          </Nav.Link>
          <Nav.Link onClick={this.addJob} eventKey="link-2">
            Add Job
          </Nav.Link>
          <Nav.Link eventKey="disabled" disabled>
            Disabled
          </Nav.Link>
        </Nav>
      </div>
    );
  }
}

export default Hamburger;
