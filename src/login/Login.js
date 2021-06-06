import { Component } from "react";
import { Link } from "react-router-dom";
import history from "../services/history";
import VerifiedUser from "../services/auth-user";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            emailId: '',
            password: '',
        };
        if(VerifiedUser.authUser.user_id) {
            history.push("/discussions-list/discussions");
        }
    }
    render() {
        return (
            <div className="container">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Login Discuss Forum</h5>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <input value={this.state.emailId} onChange={(event) => this.setState({emailId: event.target.value})} className="form-control" placeholder="Enter Email"></input> <br/>
                                <input value={this.state.password} onChange={(event) => this.setState({password: event.target.value})} className="form-control" type="password" placeholder="Enter Password"></input>
                            </div>
                        </div>
                        <div className="modal-footer modal-footer-button-center">
                            <button type="button" className="btn btn-primary width-200" onClick={this.onLogin.bind(this)}>Sign In</button>
                        </div>
                        <div className="mb-10 align-center">
                            <Link to="/accounts/signup" className="link-to">Create an Account?</Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    onLogin() {
        let userDetails = JSON.parse(JSON.stringify(this.state));
        let isValid = this.loginValid(userDetails);
        if(isValid) {
            this.sendLoginRequest(userDetails);
        } else {
            alert("The Fields cannot be empty");
        }
    }

    loginValid(userDetails) {
        if(!userDetails) {
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

    sendLoginRequest(userDetails) {
        const url = process.env.REACT_APP_BACKEND_ENDPOINT+"/accounts/signin";
        fetch(url, {
            method: 'post',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                "email_id": userDetails.emailId,
                "password": userDetails.password
            }) 
        }).then(res => res.json()).then((response) => {
            if(response.STATUS === "LOGIN SUCCESSFUL") {
                let userInfo = response.DATA;
                if(userInfo && userInfo._id && userInfo.user_name && userInfo.email_id && response.JWT_TOKEN) {
                    this.setAuthUser(userInfo,response.JWT_TOKEN);
                    history.push("/discussions-list/discussions");
                } else {
                    alert("Something went wrong! Kindly try again");
                    window.location.reload();
                }
            } else if(response.STATUS === "UNAUTHORIZED") {
                alert("Incorrect Credentials");
                window.location.reload();
            } else {
                alert("Something went wrong! Kindly try again");
                window.location.reload();
            }
        }).catch((error) => {
            console.log(error);
            alert("Something went wrong! Kindly try again");
        });
    }

    setAuthUser(userInfo, token) {
        VerifiedUser.setAuthenticatedUser(userInfo._id, userInfo.user_name, userInfo.email_id, token);
    }

}

export default Login;