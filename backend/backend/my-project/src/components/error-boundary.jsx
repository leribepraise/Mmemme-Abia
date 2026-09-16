import { Component, } from 'react';
function toError(value) {
    if (value instanceof Error) {
        return value;
    }
    if (typeof value === 'string') {
        return new Error(value);
    }
    try {
        return new Error(JSON.stringify(value));
    }
    catch {
        return new Error(String(value));
    }
}
function DefaultFallback({ error, resetError }) {
    return (<div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-lg w-full text-center">
        <h1 className="text-xl font-semibold text-gray-900">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          This part of the app hit an error. The rest of the app is still
          running.
        </p>
        {/* Dev only: messages can carry API responses and other internals. */}
        {import.meta.env.DEV ? (<pre className="mt-4 overflow-x-auto rounded bg-gray-100 p-3 text-left text-xs text-gray-800">
            {error.message || String(error)}
          </pre>) : null}
        <button type="button" onClick={resetError} className="mt-4 rounded bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-700">
          Try again
        </button>
      </div>
    </div>);
}
export class ErrorBoundary extends Component {
    state = { error: null };
    static getDerivedStateFromError(error) {
        return { error: toError(error) };
    }
    componentDidCatch(error, info) {
        console.error('ErrorBoundary caught an error:', toError(error), info.componentStack);
    }
    componentDidUpdate(prevProps) {
        if (this.state.error !== null &&
            prevProps.resetKey !== this.props.resetKey) {
            this.resetError();
        }
    }
    resetError = () => {
        this.setState({ error: null });
    };
    render() {
        const { error } = this.state;
        if (error === null) {
            return this.props.children;
        }
        const Fallback = this.props.FallbackComponent ?? DefaultFallback;
        return <Fallback error={error} resetError={this.resetError}/>;
    }
}
