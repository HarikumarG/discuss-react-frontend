let authUser = {
    user_id: undefined,
    user_name: undefined,
    email_id: undefined,
    jwt_token: undefined
};

function setAuthenticatedUser(user_id, user_name, email_id, jwt_token) {
    authUser.user_id = user_id;
    authUser.user_name = user_name;
    authUser.email_id = email_id;
    authUser.jwt_token = jwt_token;
}

function clearAuthenticatedUser() {
    authUser.user_id = undefined;
    authUser.user_name = undefined;
    authUser.email_id = undefined;
    authUser.jwt_token = undefined;
}

// eslint-disable-next-line
export default {setAuthenticatedUser, clearAuthenticatedUser, authUser};