import { Component } from "react";
import history from "../services/history";
import VerifiedUser from "../services/auth-user";

class HomeTopPane extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userAuthenticated: (VerifiedUser.authUser.user_id ? true : false),
            hideCreateDiscussion: props.hideCreateDiscussion
        }
    }
    render() {
        return (
            <nav className="navbar navbar-light bg-light justify-content-between">
                {/* eslint-disable-next-line */}
                <a className="navbar-brand"><strong>Discussion Forum</strong></a>
                <form className="form-inline">
                    {this.state.userAuthenticated && !this.state.hideCreateDiscussion &&
                        <button className="btn btn-outline-primary my-2 my-sm-0 mr-10" onClick={() => history.push("/discussions-list/discussions/create-discussion")}>Create Discussion</button>
                    }
                    {this.state.userAuthenticated === true 
                        ? <button className="btn btn-outline-danger my-2 my-sm-0" onClick={this.onLogout.bind(this)}>SignOut</button>
                        : <button className="btn btn-outline-success my-2 my-sm-0" onClick={() => history.push("/accounts/signin")}>SignIn</button>
                    }
                </form>
            </nav>
        )
    }

    onLogout() {
        if(this.state.userAuthenticated) {
            const url = process.env.REACT_APP_BACKEND_ENDPOINT+"/accounts/signout";
            let request = {
                method: 'post',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + VerifiedUser.authUser.jwt_token
                }),
                body: JSON.stringify({
                    "user_id": VerifiedUser.authUser.user_id
                }) 
            };
            fetch(url, request).then(res => res.json()).then((response) => {
                if(response.STATUS === "LOGOUT SUCCESSFUL") {
                    VerifiedUser.clearAuthenticatedUser();
                    history.push("/accounts/signin");
                    history.go();
                }
            }).catch((error) => {
                console.log(error);
                alert("Something went wrong! Kindly try again");
            });
        }
    }
}

export default HomeTopPane;