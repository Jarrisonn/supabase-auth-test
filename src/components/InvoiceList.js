import React, { Component } from "react";
import { Button, Card, Spinner } from "react-bootstrap";
import supabase from "./supabase";
class Invoicelist extends Component {
  constructor(props) {
    super(props);

    this.state = {
      invoices: null,
      loading: true,
    };
    this.changePayStatus = this.changePayStatus.bind(this);
    this.update = this.update.bind(this);
  }
  async componentDidMount() {
    console.log(this.props);

    let { data: invoices, error } = await supabase.from("invoice").select("*");
    console.log(invoices);

    this.setState({
      invoices: invoices,
      loading: false,
    });

    const invoice = supabase
      .from("invoice")
      .on("*", (payload) => {
        console.log("Change received!", payload);
        this.update();
      })
      .subscribe();
  }
  async changePayStatus(event, index, jobid) {
    const { data, error } = await supabase
      .from("invoice")
      .update({ paid: "true" })
      .eq("jobid", `${jobid}`);
  }

  async update() {
    let { data: invoices, invoiceerror } = await supabase
      .from("invoice")
      .select("*");
    console.log(invoices);
    this.setState({
      invoices: invoices,
    });
  }
  render() {
    return (
      <div className="d-flex flex-column text-center align-items-center">
        <h2>Invoice List</h2>
        <Button
          className="mb-3"
          style={{ width: "fit-content" }}
          onClick={this.props.showInvoiceList}
        >
          Close Invoice List
        </Button>
        {this.state.loading && <Spinner className='my-3' animation='border'></Spinner>}
        {!this.state.loading &&
          this.state.invoices &&
          this.state.invoices.map((invoice, index) => (
            <Card key={index} className="mb-3 border-3 align-items-center">
              <h2>Invoice ID: {invoice.id}</h2>
              <h2>Jobid: {invoice.jobid}</h2>
              <p>Price £: {invoice.price}</p>
              <p>Total inc VAT £: {invoice.vat_price}</p>
              <p>Paid Status: {String(invoice.paid)}</p>
              <Button
                onClick={(event) =>
                  this.changePayStatus(event, index, invoice.jobid)
                }
                style={{ width: "fit-content" }}
              >
                Change paid status
              </Button>
            </Card>
          ))}
      </div>
    );
  }
}

export default Invoicelist;
