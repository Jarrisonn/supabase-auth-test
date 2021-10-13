import React, { Component } from "react";
import { Nav,Spinner } from "react-bootstrap";
import "../styles/hamburger.css";
import Profile from "./Profile";
class Hamburger extends Component {
  constructor(props) {
    super(props);

    this.state = {
        loading:true,
    }

    this.openProfile = this.openProfile.bind(this);
    this.addJob = this.addJob.bind(this);
    this.viewJobs = this.viewJobs.bind(this)
  }
 async componentDidMount() {
    console.log(this.props);
    console.log('Hamburger Mounted');
    this.props.closeProfile();
    this.props.closeAddJob();
    this.setState({
        loading: false,
    })
  }
  addJob() {
    this.props.getAddJob();
    
    this.props.closeMenu();
  }
  openProfile() {
    this.props.showProfile();
    this.props.closeMenu();
  }
  viewJobs(){
      this.props.closeAddJob();
    this.props.closeMenu();
  }
  render() {
    return (
      <div>
          {this.state.loading && <Spinner></Spinner>}
        {!this.state.loading && <Nav
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
          <Nav.Link onClick={this.viewJobs}>
            View Jobs
          </Nav.Link>
        </Nav>}
      </div>
    );
  }
}

export default Hamburger;
