import { Component } from "react"
import { Link } from "react-router-dom";
import HomeTopPane from "../home-top-pane/HomeTopPane";

class DiscussionList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            discussionsData: []
        }
    }

    componentDidMount() {
        this.sendGetDiscussionsListRequest();
    }

    render() {
        return (
            <div>
                <HomeTopPane/>
                <div className="container all-discussions">
                    <hgroup className="mb-20">
                        <h1>All Discussions</h1>
                    </hgroup>
                    <section className="col-xs-12 col-sm-6 col-md-12" style={{maxHeight: "450px", overflowY: "auto"}}>
                        {
                            this.state.discussionsData.map(row => 
                                <article key={row._id} className="search-result row">
                                    <div className="col-xs-12 col-sm-12 col-md-7">
                                        <h3><Link to={`/discussions-list/discussions/${row._id}`} className="link">{row.topic_name}</Link></h3>
                                        <small className="text-muted">Created By: {row.user_id.user_name}</small> <br/>
                                        <small className="text-muted">Created Time: {row.topic_created_time}</small>
                                    </div>
                                </article>
                            )
                        }
                    </section>
                </div>
            </div>
        )
    }

    sendGetDiscussionsListRequest() {
        const url = process.env.REACT_APP_BACKEND_ENDPOINT+"/discussions-list/discussions";
        fetch(url, {
            method: 'get',
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).then(res => res.json()).then((response) => {
            if(response.STATUS === "SUCCESS") {
                let data = response.DATA;
                if(data) {
                    for(var i = 0; i < data.length; i++) {
                        data[i].topic_created_time = new Date(data[i].topic_created_time).toLocaleString("en-US",{
                            dateStyle: "medium",
                            timeStyle: "short"
                        });
                    }
                    this.setState({discussionsData: data});
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
}

export default DiscussionList;