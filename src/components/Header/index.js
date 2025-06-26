import {withRouter, Link} from 'react-router-dom'
import {FaHome} from 'react-icons/fa'
import {RiLogoutBoxRLine} from 'react-icons/ri'
import {BsFillEnvelopeFill} from 'react-icons/bs'

import Cookies from 'js-cookie'

import './index.css'

const Header = props => {
  const onClickLogOut = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="header-nav-container">
      <div className="nav-sm-container">
        <div className="nav-sm-flex-card">
          <Link to="/">
            <img
              className="image"
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
            />
          </Link>
        </div>
        <div className="icons-manage">
          <ul className="unOrdered-list-nav-icons-card">
            <li>
              <Link to="/" className="link-home-element">
                <FaHome size="20" className="i" />
              </Link>
            </li>
            <li>
              <Link to="/jobs">
                <BsFillEnvelopeFill size="20" className="i" />
              </Link>
            </li>
            <li>
              <Link to="/login">
                <RiLogoutBoxRLine
                  size="20"
                  onClick={onClickLogOut}
                  className="i"
                />
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="nav-md-card-container">
        <div>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="image"
          />
        </div>
        <div className="icons-manage">
          <ul className="unOrder-nav-list">
            <li>
              <Link to="/" className="link-home-element">
                Home
              </Link>
            </li>
            <li>
              <h4 className="link-home-element">
                <Link to="/jobs" className="link-home-element">
                  Jobs
                </Link>
              </h4>
            </li>
          </ul>
        </div>
        <div>
          <button type="button" onClick={onClickLogOut} className="nav-button">
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default withRouter(Header)
