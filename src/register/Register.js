import { Component } from "react";
import { Link } from "react-router-dom";
import history from "../services/history";
import VerifiedUser from "../services/auth-user";

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            emailId: '',
            password: '',
        };
        if(VerifiedUser.authUser.user_id) {
            history.goBack();
        }
    }

    render() {
        return (
            <div className="container">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Register Discuss Forum</h5>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <input value={this.state.userName} onChange={(event) => this.setState({userName: event.target.value})} className="form-control" placeholder="Enter User Name"></input> <br/>
                                <input value={this.state.emailId} onChange={(event) => this.setState({emailId: event.target.value})} className="form-control" placeholder="Enter Email"></input> <br/>
                                <input value={this.state.password} onChange={(event) => this.setState({password: event.target.value})} className="form-control" type="password" placeholder="Enter Password"></input>
                            </div>
                        </div>
                        <div className="modal-footer modal-footer-button-center">
                            <button type="button" className="btn btn-primary width-200" onClick={this.onRegister.bind(this)}>Sign Up</button>
                        </div>
                        <div className="mb-10 align-center">
                            <Link to="/accounts/signin" className="link-to">Already have an Account?</Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    onRegister() {
        let userDetails = JSON.parse(JSON.stringify(this.state));
        let isValid = this.registerValid(userDetails);
        if(isValid) {
            this.sendRegisterRequest(userDetails);
        } else {
            alert("The Fields cannot be empty");
        }
    }

    registerValid(userDetails) {
        if(!userDetails) {
            return false;
        }
        if(!userDetails.userName || /^\s*$/.test(userDetails.userName)) {
            return false;
        }
        if(!userDetails.emailId || /^\s*$/.test(userDetails.emailId)) {
            return false;
        }
        if(!userDetails.password || /^\s*$/.test(userDetails.password)) {
            return false;
        }
        return true;
    }

    sendRegisterRequest(userDetails) {
        const url = process.env.REACT_APP_BACKEND_ENDPOINT+"/accounts/signup";
        fetch(url, {
            method: 'post',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                "user_name": userDetails.userName,
                "email_id": userDetails.emailId,
                "password": userDetails.password
            }) 
        }).then(res => res.json()).then((response) => {
            if(response.STATUS === "REGISTRATION SUCCESSFUL") {
                history.push("/accounts/signin");
            }
        }).catch((error) => {
            console.log(error);
            alert("Something went wrong! Kindly try again");
        });
    }
}

export default Register;