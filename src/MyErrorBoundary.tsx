import React from 'react';

type MyErrorBoundaryState = { hasError: boolean };

export default class MyErrorBoundary extends React.Component<any, MyErrorBoundaryState> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.log('MyErrorBoundary error:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div></div>;
    }

    return this.props.children;
  }
}
