import { Component, type ReactNode } from 'react'

type Props = {
  children: ReactNode
}

type State = {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            background: '#1a1a2e',
            color: '#e0e0e0',
            gap: '12px',
            padding: '24px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '18px', color: '#e74c3c' }}>
            エラーが発生しました
          </div>
          <div style={{ fontSize: '13px', color: '#a0a0b0', maxWidth: '480px' }}>
            {this.state.error?.message}
          </div>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              padding: '8px 16px',
              background: '#4a90d9',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            再試行
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
