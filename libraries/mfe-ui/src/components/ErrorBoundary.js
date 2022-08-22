import React, { Component } from "react";

class ErrorBoundary extends Component {
    state = {
        hasError: false
    };

    getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Bounded error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <span>{this.props.errorMessage}</span>;
        }

        return this.props.children;
    }
}

export { ErrorBoundary };
