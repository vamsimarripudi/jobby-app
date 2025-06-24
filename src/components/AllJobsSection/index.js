import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {BsSuitcase, BsBoxArrowUpRight} from 'react-icons/bs'
import {IoLocationOutline, IoStar} from 'react-icons/io5'

import Cookies from 'js-cookie'
import Header from '../Header'
import SimilarJobs from '../similar jobs'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobsSection extends Component {
  state = {
    similarJobs: [],
    lifeAtCompany: {},
    apiStatus: apiStatusConstants.initial,
    skills: [],
    jobData: {},
  }

  componentDidMount() {
    this.getJobsDetails()
  }

  getFormattedData = data => ({
    id: data.id,
    companyLogoUrl: data.company_logo_url,
    employmentType: data.employment_type,
    jobDescription: data.job_description,
    location: data.location,
    packagePerAnnum: data.package_per_annum,
    rating: data.rating,
    title: data.title,
    companyWebsiteUrl: data.company_website_url,
  })

  getCompanyData = data => ({
    description: data.description,
    companyImageUrl: data.image_url,
  })

  getSkillData = data => ({
    imageUrl: data.image_url,
    name: data.name,
  })

  getJobsDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({apiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
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

      const updatedJobData = this.getFormattedData(data.job_details)
      const updatedLifeAtCompanyData = this.getCompanyData(
        data.job_details.life_at_company,
      )
      const updatedSkillData = data.job_details.skills.map(each =>
        this.getSkillData(each),
      )
      const updatedSimilarJob = data.similar_jobs.map(eachJob =>
        this.getFormattedData(eachJob),
      )

      this.setState({
        jobData: updatedJobData,
        skills: updatedSkillData,
        lifeAtCompany: updatedLifeAtCompanyData,
        similarJobs: updatedSimilarJob,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-card">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-view-head">Oops! Something Went Wrong</h1>
      <p className="failure-view-para">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        className="retry-button"
        type="button"
        onClick={this.onResetButton}
      >
        Retry
      </button>
    </div>
  )

  onResetButton = () => this.getJobDetails()

  renderSuccessJobDetailsView = () => {
    const {jobData, similarJobs, lifeAtCompany, skills} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobData
    const {description, companyImageUrl} = lifeAtCompany

    return (
      <>
        <div className="job-detailed-card">
          <div className="job-detail-top-card">
            <img
              className="company-logo"
              src={companyLogoUrl}
              alt="job details company logo"
            />
            <div>
              <h1 className="company-title">{title}</h1>
              <div className="title-bottom-card">
                <IoStar color="orange" size="15" />
                <p className="job-card-rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="job-card-middle-session">
            <div className="job-middle-start">
              <div className="location-card-container">
                <IoLocationOutline size="20" color="#f1f5f9" />
                <p className="location-title">{location}</p>
              </div>
              <div className="location-card-container">
                <BsSuitcase size="20" color="#f1f5f9" />
                <p className="location-title">{employmentType}</p>
              </div>
            </div>
            <div>
              <p className="package-card">{packagePerAnnum}</p>
            </div>
          </div>
          <hr className="hr-bar" />
          <div className="job-middle-section-top-card">
            <p className="description-para">Description</p>
            <a className="anchor-tag" href={companyWebsiteUrl}>
              Visit <BsBoxArrowUpRight size="13" />
            </a>
          </div>
          <p className="description">{jobDescription}</p>
          <h1 className="skill-heading">Skills</h1>
          <ul className="ul-ordered-list">
            {skills.map(eachSkill => (
              <li className="list-order-item" key={eachSkill.name}>
                <img
                  className="skill-icon"
                  src={eachSkill.imageUrl}
                  alt={eachSkill.name}
                />
                <p>{eachSkill.name}</p>
              </li>
            ))}
          </ul>
          <h1 className="company-heading">Life At Company</h1>
          <div className="life-at-company-card">
            <p className="company-para">{description}</p>
            <img className="company-image" src={companyImageUrl} alt={title} />
          </div>
        </div>
        <div className="similar-card-section-area">
          <h1 className="company-head">Similar Jobs</h1>
          <ul className="unOrdered-list">
            {similarJobs.map(eachJob => (
              <SimilarJobs similarJobs={eachJob} />
            ))}
          </ul>
        </div>
      </>
    )
  }

  renderFinalView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.success:
        return this.renderSuccessJobDetailsView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-section-card">
          <center>End</center>
          {this.renderFinalView()}
        </div>
      </>
    )
  }
}

export default JobsSection
