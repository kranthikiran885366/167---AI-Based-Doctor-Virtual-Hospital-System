import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error for debugging
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-md p-8"
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-6"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Something went wrong
            </h1>
            
            <p className="text-gray-600 mb-6">
              The AI Doctor system encountered an unexpected error. Don't worry, your data is safe.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={this.handleReload}
                className="w-full flex items-center justify-center space-x-2 py-3 px-6 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Reload Application</span>
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="w-full flex items-center justify-center space-x-2 py-3 px-6 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                <Home className="w-5 h-5" />
                <span>Go to Home</span>
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Technical Details
                </summary>
                <div className="mt-2 p-4 bg-gray-100 rounded-lg text-xs text-gray-700 font-mono overflow-auto max-h-40">
                  <div className="mb-2">
                    <strong>Error:</strong> {this.state.error.toString()}
                  </div>
                  <div>
                    <strong>Stack:</strong>
                    <pre className="whitespace-pre-wrap mt-1">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                </div>
              </details>
            )}
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
