import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class Login extends Component {
  state = {username: '', password: '', showErrMsg: false, errorMsg: ''}

  onUserNameChangeEvent = event => {
    this.setState({username: event.target.value})
  }

  onPasswordChangeEvent = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {expires: 30, path: '/'})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showErrMsg: true, errorMsg})
  }

  onSubmitForm = async event => {
    event.preventDefault()

    const {username, password} = this.state
    const userDetails = {username, password}
    const apiUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  renderPasswordField = () => {
    const {password} = this.state
    return (
      <>
        <label className="label-heading" htmlFor="password">
          PASSWORD
        </label>
        <br />
        <input
          placeholder="Password"
          className="password-input-field"
          type="password"
          id="password"
          value={password}
          onChange={this.onPasswordChangeEvent}
        />
      </>
    )
  }

  renderUsernameField = () => {
    const {username} = this.state
    return (
      <>
        <label className="label-heading" htmlFor="username">
          USERNAME
        </label>
        <br />
        <input
          placeholder="Username"
          className="username-input-field"
          type="text"
          id="username"
          value={username}
          onChange={this.onUserNameChangeEvent}
        />
      </>
    )
  }

  render() {
    const {showErrMsg, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="loginForm-container">
        <form className="login-form-element" onSubmit={this.onSubmitForm}>
          <div>
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="login-image"
            />
          </div>
          <hr className="horizontal" />
          <div>
            <div>{this.renderUsernameField()}</div>
            <div>{this.renderPasswordField()}</div>
            <button className="login-button" type="submit">
              Login
            </button>
            {showErrMsg && <p className="error-paragraph">{errorMsg}</p>}
          </div>
        </form>
      </div>
    )
  }
}

export default Login
