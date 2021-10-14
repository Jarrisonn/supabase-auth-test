import React, { Component } from "react";
import { Nav,Spinner } from "react-bootstrap";
import "../styles/hamburger.css";
import Profile from "./Profile";
class Hamburger extends Component {
  constructor(props) {
    super(props);

    this.state = {
        loading:true,
        sprayaway: null,
    }

    this.openProfile = this.openProfile.bind(this);
    this.addJob = this.addJob.bind(this);
    this.viewJobs = this.viewJobs.bind(this)
    this.signOut = this.signOut.bind(this)
    this.getInvoiceList = this.getInvoiceList.bind(this)
  }
 async componentDidMount() {
    console.log(this.props);
    console.log('Hamburger Mounted');
    this.props.closeProfile();
    this.props.closeAddJob();
    this.props.closeInvoiceList();
    this.setState({
        loading: false,
        sprayaway: this.props.sprayaway
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
  signOut(){
    this.props.signOut()
  }
  getInvoiceList(){
    this.props.getInvoiceList();
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
          <Nav.Link onClick={this.signOut}>Sign Out</Nav.Link>
          <Nav.Link onClick={this.openProfile} eventKey="link-1">
            Profile
          </Nav.Link>
          <Nav.Link onClick={this.addJob} eventKey="link-2">
            Add Job
          </Nav.Link>
          <Nav.Link onClick={this.viewJobs}>
            View Jobs
          </Nav.Link>
          {this.state.sprayaway && <Nav.Link onClick={this.getInvoiceList}>
            View Invoices
          </Nav.Link>}
          
        </Nav>}
      </div>
    );
  }
}

export default Hamburger;
