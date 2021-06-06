import { Router, Switch, Route} from 'react-router-dom';
import Login from './login/Login';
import Register from './register/Register';
import DiscussionList from './discussion-list/DiscussionList';
import CreateDiscussion from './create-discussion/CreateDiscussion';
import history from './services/history';
import Discussion from './discussion/Discussion';

const routes = () =>  (
                <Router history={history}>
                    <Switch>
                        <Route exact path="/accounts/signin" component={Login} />
                        <Route exact path="/accounts/signup" component={Register} />
                        <Route exact path="/discussions-list/discussions" component={DiscussionList} />
                        <Route exact path="/discussions-list/discussions/create-discussion" component={CreateDiscussion} />
                        <Route exact path="/discussions-list/discussions/:topic_id" component={Discussion} />
                    </Switch>
                </Router>
        )

export default routes;