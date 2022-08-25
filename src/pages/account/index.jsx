import React from "react";
import {withRouter} from "next/router.js";

class Account extends React.Component {
    componentDidMount() {
        this.props.router.push('/account/personal')
    }

    render() {
    }
}

export default withRouter(Account)
