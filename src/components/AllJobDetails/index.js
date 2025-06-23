import {Component} from 'react'
import Cookies from 'js-cookie'
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
    similarJobs: {},
    profileDetails: {},
    checkBoxContains: '',
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
      console.log(data)
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
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/jobs'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)

    if (response.ok === true) {
      const fetchedJobDetails = await response.json()
      console.log(fetchedJobDetails)

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
      console.log(updatedJobDetails)

      this.setState({
        jobsList: updatedJobDetails,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderProfileDetailsView = () => {
    const {profileDetails} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails

    return (
      <div className="profile-card-container">
        <div>
          <img src={profileImageUrl} alt={name} />
          <h1 className="profile-heading">{name}</h1>
          <p className="profile-short-bio">{shortBio}</p>
        </div>
      </div>
    )
  }

  renderEmploymentTypeView = () => (
    <div className="employment-card-container">
      <p className="employment-type-para">Type of Employment</p>
      <ul className="employment-type-list">
        {employmentTypesList.map(each => (
          <li key={each.employmentTypeId}>
            <input
              className="employment-checkbox"
              type="checkbox"
              id={each.employmentTypeId}
            />
            <label htmlFor={each.employmentTypeId} value={each.label}>
              {each.label}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )

  renderSalaryTypeView = () => (
    <div className="employment-card-container">
      <p className="employment-type-para">Salary Range</p>
      <ul className="employment-type-list">
        {salaryRangesList.map(each => (
          <li key={each.salaryRangeId}>
            <input
              className="employment-checkbox"
              type="radio"
              id={each.salaryRangeId}
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

  render() {
    const {jobsList} = this.state
    return (
      <div className="job-details-card">
        <div className="profile-card">
          {this.renderEmploymentTypeView()}
          <hr className="hr-element" />
          {this.renderSalaryTypeView()}
        </div>
        <div className="joblist-card">
          {jobsList.map(eachjob => (
            <JobCard key={eachjob.id} jobCardDetails={eachjob} />
          ))}
        </div>
      </div>
    )
  }
}

export default AllJobDetails
