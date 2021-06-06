import { Component } from "react";
import HomeTopPane from "../home-top-pane/HomeTopPane";
import history from "../services/history";
import VerifiedUser from "../services/auth-user";

class CreateDiscussion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            topic_name: '',
            description: ''
        }
        if(VerifiedUser.authUser.user_id === undefined) {
            history.push("/accounts/signin");
        }
    }

    render() {
        return (
            <div>
                <HomeTopPane hideCreateDiscussion={true}/>
                <div className="container">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4>Create Discussion</h4>
                                <button type="button" className="btn btn-light" onClick={() => history.goBack()}> Back </button>
                            </div>
                            <div className="modal-body chat-body">
                                <div className="content">
                                    <div className="md-form">
                                        <label>Topic: </label>
                                        <textarea id="create-discussion-title" value={this.state.topic_name} onChange={(event) => this.setState({topic_name: event.target.value})} className="md-textarea form-control" rows="1"></textarea>
                                    </div>
                                    <div className="form-group mt-10">
                                        <label>Description:</label>
                                        <textarea className="form-control" id="create-discussion-description" onChange={(event) => this.setState({description: event.target.value})} value={this.state.description} rows="10"></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <div className="input-group justify-space-even">
                                    <span className="input-group-btn">
                                        <button type="button" className="btn btn-primary width-200" onClick={this.onCreateDiscussion.bind(this)}> Create </button>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    onCreateDiscussion() {
        let topicData = JSON.parse(JSON.stringify(this.state));
        let isValid = this.createDiscussionValid(topicData);
        if(isValid) {
            this.sendCreateDiscussionRequest(topicData.topic_name, topicData.description);
        } else {
            alert("The Fields cannot be empty");
        }
    }

    createDiscussionValid(topicData) {
        if(!topicData) {
            return false;
        }
        if(!topicData.topic_name || /^\s*$/.test(topicData.topic_name)) {
            return false;
        }
        if(!topicData.description || /^\s*$/.test(topicData.description)) {
            return false;
        }
        return true;
    }

    sendCreateDiscussionRequest(topic_name, description) {
        if(VerifiedUser.authUser.user_id) {
            const url = process.env.REACT_APP_BACKEND_ENDPOINT+"/discussions-list/create-discussion";
            let request = {
                method: 'post',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + VerifiedUser.authUser.jwt_token
                }),
                body: JSON.stringify({
                    "user_id": VerifiedUser.authUser.user_id,
                    "topic_name": topic_name,
                    "description": description
                }) 
            };
            fetch(url, request).then(res => res.json()).then((response) => {
                if(response.STATUS === "SUCCESS") {
                    history.push("/discussions-list/discussions");
                } else if (response.STATUS === "UNAUTHORIZED") {
                    alert("Kindly Login and Try again");
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
    }
}

export default CreateDiscussion;