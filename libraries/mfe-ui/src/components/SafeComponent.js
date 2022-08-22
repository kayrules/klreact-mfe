import React, { Component } from "react";
import { MockComponent } from "./MockComponent";

class SafeComponent extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Bounded error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <MockComponent placeholder="Something went wrong" />
            // .. or push error to bugsnag / splunk
        }

        return this.props.children;
    }
}

export { SafeComponent };
