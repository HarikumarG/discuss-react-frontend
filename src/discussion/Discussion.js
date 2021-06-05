import { Component } from "react";
import HomeTopPane from "../home-top-pane/HomeTopPane";
import VerifiedUser from "../services/auth-user";
import history from "../services/history";

class Discussion extends Component {

    constructor(props) {
        super(props);
        this.state = {
            discussionData: {},
            replyData: [],
            userAuthenticated: (VerifiedUser.authUser.user_id ? true : false),
            replyValue: ''
        }
    }

    componentDidMount() {
        const {match: {params}} = this.props;
        let topic_id = params.topic_id;
        this.sendGetDiscussionRequest(topic_id);
        this.setState({topic_id: topic_id});
    }
    render() {
        return (
            <div>
                <HomeTopPane />
                <div className="container all-discussions">
                {
                    this.state.discussionData.user_id && this.state.replyData &&
                    <div>
                        <hgroup className="mb-20">
                            <div className="d-flex justify-content-between">
                                <h1>Discussion</h1>
                                <button className="btn btn-primary" onClick={()=> history.push("/discussions-list/discussions")}>View All Discussions</button>
                            </div>
                            <small className="text-muted">Created By: {this.state.discussionData.user_id.user_name}</small> <br/>
                            <small className="text-muted">Created Time: {this.state.discussionData.topic_created_time}</small>
                        </hgroup>

                        <section className="col-xs-12 col-sm-6 col-md-12">
                            <article className="search-result row">
                                <div className="col-xs-12 col-sm-12 col-md-7">
                                    {/* eslint-disable-next-line */}
                                    <h3><a>{this.state.discussionData.topic_name}</a></h3>
                                    <p>{this.state.discussionData.description}</p>
                                </div>
                            </article>
                            <small className="text-muter"><strong>Comments:</strong></small>
                            {
                                this.state.replyData.length > 0
                                ?   <div className="reply-content" style={{maxHeight: "200px", overflowY: "auto"}}>
                                        {
                                            this.state.replyData.map(reply => 
                                                <div key={reply._id}>
                                                    <div id="reply-id">{reply.reply_content}</div>
                                                    <small className="text-muted">Created By: {reply.user_id.user_name}</small> <br/>
                                                    <small className="text-muted">Created Time: {reply.reply_created_time}</small>
                                                </div>
                                            )
                                        }
                                    </div>
                                :   <div>
                                        <small className="text-muted">No Comments Yet</small>
                                    </div>   
                            }
                            {
                                this.state.userAuthenticated && 
                                <div className="input-group">
                                    <input type="text" value={this.state.replyValue} onChange={(event) => this.setState({replyValue: event.target.value})} className="form-control input-sm" placeholder="your reply here..."></input>
                                    <span className="input-group-btn">
                                        <button type="button" className="btn btn-primary" onClick={this.onCreateReply.bind(this)}>
                                        reply
                                        </button>
                                    </span>
                                </div>
                            }
                        </section>
                    </div>
                }
                </div>
            </div>
        )
    }

    sendGetDiscussionRequest(topic_id) {
        const url = process.env.REACT_APP_BACKEND_ENDPOINT+"/discussions-list/discussions/"+topic_id;
        fetch(url, {
            method: 'get',
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).then(res => res.json()).then((response) => {
            if(response.STATUS === "SUCCESS") {
                let data = response.DATA;
                if(data && data.topic_data && data.reply_data) {
                    data.topic_data.topic_created_time = new Date(data.topic_data.topic_created_time).toLocaleString("en-US",{
                        dateStyle: "medium",
                        timeStyle: "short"
                    });
                    for(var i = 0; i < data.reply_data.length; i++) {
                        data.reply_data[i].reply_created_time = new Date(data.reply_data[i].reply_created_time).toLocaleString("en-US",{
                            dateStyle: "medium",
                            timeStyle: "short"
                        });
                    }
                    this.setState({
                        discussionData: data.topic_data,
                        replyData: data.reply_data
                    });
                } else {
                    alert("Something went wrong! Kindly try again");
                }
            } else {
                alert("Something went wrong! Kindly try again");
            }
        }).catch((error) => {
            console.log(error);
            alert("Something went wrong! Kindly try again");
        });
    }

    onCreateReply() {
        if(this.state.replyValue && !/^\s*$/.test(this.state.replyValue)) {
            let createReply = JSON.parse(JSON.stringify(this.state));
            this.sendCreateReplyRequest(createReply);
            this.setState({replyValue: ''});
        }
    }

    sendCreateReplyRequest(createReply) {
        if(this.state.userAuthenticated) {
            const url = process.env.REACT_APP_BACKEND_ENDPOINT+"/discussions-list/discussions/"+createReply.topic_id+"/create-reply";
            let request = {
                method: 'post',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + VerifiedUser.authUser.jwt_token
                }),
                body: JSON.stringify({
                    "user_id": VerifiedUser.authUser.user_id,
                    "reply_content": createReply.replyValue
                }) 
            };
            fetch(url, request).then(res => res.json()).then((response) => {
                if(response.STATUS === "SUCCESS") {
                    this.componentDidMount();
                }
            }).catch((error) => {
                console.log(error);
                alert("Something went wrong! Kindly try again");
            });
        }
    }
}

export default Discussion;