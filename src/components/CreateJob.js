import React, { Component } from 'react';
import '../styles/createjob.css'
import supabase from './supabase';
class CreateJob extends Component {
    constructor(props){
        super(props);

        this.state = {
            session: null,
            make: '',
            model: '',
            reg: '',
            time: '',
            description: '',

        }

        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.insertRow = this.insertRow.bind(this)
        this.closeAddJob = this.closeAddJob.bind(this)
    }

    componentDidMount(){
        this.setState({
            session: this.props.session,
        })
    }

    onChange(event){

        console.log(event);
        this.setState({
            [event.target.name]: event.target.value,
        })
    }

    onSubmit(event){
        event.preventDefault()
        console.log('submitted');
        console.log(this.state.session.user.id);

        console.log(this.state);
        this.insertRow();
        this.props.getJob();
    }

    async insertRow(){
        console.log('row inserted');
        console.log(this.state);

        const { data, error } = await supabase
        .from('job')
        .insert([
        { userid: this.state.session.user.id, car_model: this.state.model, car_make: this.state.make, car_reg: this.state.reg, time_requested: this.state.time, description: this.state.description},
        ])

    }
    closeAddJob(){
        this.props.getJob();
    }

    render() {
        return (
            <div>
                <form className='addform' onSubmit={event => this.onSubmit(event)}>
                    <h2>Add Job Here: </h2>
                    <label>Car Make:</label>
                    <input name='make'value={this.state.make} onChange={this.onChange}/>
                    <label>Car Model:</label>
                    <input name='model'value={this.state.model} onChange={this.onChange}/>
                    <label>Car Reg:</label>
                    <input name='reg'value={this.state.reg} onChange={this.onChange}/>
                    <label>Time Requested:</label>
                    <input type='time' name='time'value={this.state.time} onChange={this.onChange}/>
                    <label>Job Description:</label>
                    <textarea name='description'value={this.state.description} onChange={this.onChange}/>
                    <button onClick={this.closeAddJob}>X</button>
                    <button>Add Job</button>
                </form>
            </div>
        );
    }
}

export default CreateJob;
