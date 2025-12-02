import {Component} from 'react'
import Cookies from 'js-cookie'
import {IoSearch} from 'react-icons/io5'
import Loader from 'react-loader-spinner'
import JobCard from '../JobCard'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
const salaryRangesList = [
  {salaryRangeId: '1000000', label: '10 LPA and above'},
  {salaryRangeId: '2000000', label: '20 LPA and above'},
  {salaryRangeId: '3000000', label: '30 LPA and above'},
  {salaryRangeId: '4000000', label: '40 LPA and above'},
]

const employmentTypesList = [
  {label: 'Full Time', employmentTypeId: 'FULLTIME'},
  {label: 'Part Time', employmentTypeId: 'PARTTIME'},
  {label: 'Freelance', employmentTypeId: 'FREELANCE'},
  {label: 'Internship', employmentTypeId: 'INTERNSHIP'},
]

class AllJobDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    jobsList: [],
    profileDetails: {},
    checkBoxContains: [],
    apiJobStatus: apiStatusConstants.initial,
    salaryRange: '',
    searchInput: '',
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobDetails()
  }

  getProfileDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()

      const updatedStatus = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        profileDetails: updatedStatus,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  getJobDetails = async () => {
    this.setState({apiJobStatus: apiStatusConstants.inProgress})
    const {salaryRange, checkBoxContains, searchInput} = this.state
    const type = checkBoxContains.join(',')
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${type}&minimum_package=${salaryRange}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)

    if (response.ok === true) {
      const fetchedJobDetails = await response.json()

      const updatedJobDetails = fetchedJobDetails.jobs.map(eachJob => ({
        id: eachJob.id,
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))

      this.setState({
        jobsList: updatedJobDetails,
        apiJobStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiJobStatus: apiStatusConstants.failure})
    }
  }

  renderProfileDetailsView = () => {
    const {profileDetails} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails

    return (
      <div className="profile-card-container">
        <div>
          <img
            className="profile-logo"
            src={profileImageUrl}
            alt="profile_image_url"
          />
          <h1 className="profile-heading">{name}</h1>
          <p className="profile-short-bio">{shortBio}</p>
        </div>
      </div>
    )
  }

  renderEmploymentTypeView = () => (
    <div className="employment-card-container">
      <h1 className="employment-type-para">Type of Employment</h1>
      <ul className="employment-type-list">
        {employmentTypesList.map(each => (
          <li key={each.employmentTypeId}>
            <input
              className="employment-checkbox"
              type="checkbox"
              id={each.employmentTypeId}
              onChange={this.onClickCheckboxList}
            />
            <label htmlFor={each.employmentTypeId}>{each.label}</label>
          </li>
        ))}
      </ul>
    </div>
  )

  renderSalaryTypeView = () => (
    <div className="salary-card-container">
      <h1 className="employment-type-para">Salary Range</h1>
      <ul className="employment-type-list">
        {salaryRangesList.map(each => (
          <li key={each.salaryRangeId}>
            <input
              className="employment-checkbox"
              type="radio"
              name="option"
              id={each.salaryRangeId}
              onChange={this.onSelectSalaryRange}
            />
            <label htmlFor={each.salaryRangeId}>{each.label}</label>
          </li>
        ))}
      </ul>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.getJobDetails()
    }
  }

  onSelectSalaryRange = event => {
    this.setState({salaryRange: event.target.id}, this.getJobDetails)
  }

  onSubmitSearchInput = () => {
    this.getJobDetails()
  }

  onClickCheckboxList = event => {
    const {checkBoxContains} = this.state

    if (checkBoxContains.includes(event.target.id)) {
      const updatedId = checkBoxContains.filter(
        each => each !== event.target.id,
      )
      this.setState({checkBoxContains: updatedId}, this.getJobDetails)
    } else {
      this.setState(
        prevState => ({
          checkBoxContains: [...prevState.checkBoxContains, event.target.id],
        }),
        this.getJobDetails,
      )
    }
  }

  onSearchInput = () => {
    const {searchInput} = this.state
    return (
      <div className="search-input-card">
        <input
          value={searchInput}
          type="search"
          onKeyDown={this.onEnterSearchInput}
          onChange={this.onChangeSearchInput}
          placeholder="Search"
          className="search-input"
        />
        <button
          data-testid="searchButton"
          type="button"
          className="search-icon"
          onClick={this.onSubmitSearchInput}
        >
          <IoSearch size="18" />
        </button>
      </div>
    )
  }

  onSuccessJobsView = () => {
    const {jobsList} = this.state
    const noOfJobs = jobsList.length > 0
    return noOfJobs ? (
      <div className="joblist-card">
        {jobsList.map(eachjob => (
          <JobCard key={eachjob.id} jobCardDetails={eachjob} />
        ))}
      </div>
    ) : (
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
        />
        <h1>No jobs found</h1>
        <p>We could not find any jobs. Try other filters.</p>
      </div>
    )
  }

  retryButton = () => this.getProfileDetails()

  retryJobsButton = () => this.getJobDetails()

  onFailureProfileView = () => (
    <>
      <h1>profile Fail</h1>
      <button type="button" onClick={this.retryButton}>
        Retry
      </button>
    </>
  )

  onFailureJobsView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>we cannot seem to find the page you are looking for</p>
      <div>
        <button onClick={this.retryJobsButton} type="button">
          Retry
        </button>
      </div>
    </div>
  )

  onRenderProfile = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.onFailureProfileView()
      case apiStatusConstants.success:
        return this.renderProfileDetailsView()
      default:
        return apiStatusConstants.initial
    }
  }

  onRenderJobView = () => {
    const {apiJobStatus} = this.state

    switch (apiJobStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.onFailureJobsView()
      case apiStatusConstants.success:
        return this.onSuccessJobsView()
      default:
        return apiStatusConstants.initial
    }
  }

  render() {
    return (
      <div className="job-details-card">
        <div className="profile-card">
          <div className="sm-search-input">{this.onSearchInput()}</div>
          {this.onRenderProfile()}
          <hr className="hr-element" />
          {this.renderEmploymentTypeView()}
          <hr className="hr-element" />
          {this.renderSalaryTypeView()}
        </div>
        <div>
          <div className="lg-search-input">{this.onSearchInput()}</div>
          {this.onRenderJobView()}
        </div>
      </div>
    )
  }
}

export default AllJobDetails
