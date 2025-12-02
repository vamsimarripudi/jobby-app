import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {FaStar} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import {RiSuitcaseLine} from 'react-icons/ri'
import {BsBoxArrowUpRight} from 'react-icons/bs'
import SimilarJobs from '../SimilarJobs'
import Header from '../Header'
import './index.css'

const apiStatusConstructor = {
  initial: 'INITIAL',
  failure: 'FAILURE',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobData: [],
    similarJobsData: [],
    apiStatus: apiStatusConstructor.initial,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.setState({apiStatus: apiStatusConstructor.inProgress})

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
      const fetchedData = await response.json()
      console.log(fetchedData)
      const jobDetailsListData = [fetchedData.job_details].map(each => ({
        id: each.id,
        companyLogoUrl: each.company_logo_url,
        companyWebsiteUrl: each.company_website_url,
        employmentType: each.employment_type,
        location: each.location,
        rating: each.rating,
        title: each.title,
        jobDescription: each.job_description,
        lifeAtCompany: {
          description: each.life_at_company.description,
          imageUrl: each.life_at_company.image_url,
        },
        skills: each.skills.map(eachItem => ({
          imageUrl: eachItem.image_url,
          name: eachItem.name,
        })),
        packagePerAnnum: each.package_per_annum,
      }))

      const fetchedSimilarJobsData = fetchedData.similar_jobs.map(eachJob => ({
        id: eachJob.id,
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        title: eachJob.title,
        location: eachJob.location,
        rating: eachJob.rating,
        jobDescription: eachJob.job_description,
      }))

      this.setState({
        apiStatus: apiStatusConstructor.success,
        jobData: jobDetailsListData,
        similarJobsData: fetchedSimilarJobsData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstructor.failure})
    }
  }

  renderFailureView = () => (
    <div className="failure-card">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" className="retry-button" onClick={this.onRetry}>
        Retry
      </button>
    </div>
  )

  onRetry = () => this.getJobDetails()

  renderJobDetailsCard = () => {
    const {jobData, similarJobsData} = this.state

    if (jobData.length >= 1) {
      const {
        companyLogoUrl,
        companyWebsiteUrl,
        jobDescription,
        rating,
        location,
        title,
        lifeAtCompany,
        skills,
        employmentType,
        packagePerAnnum,
      } = jobData[0]

      return (
        <>
          <div className="job-card-collection">
            <div className="company-top-card">
              <img
                src={companyLogoUrl}
                alt="job details company logo"
                className="company-logo"
              />
              <div>
                <h1 className="company-title">{title}</h1>
                <div className="company-sub-top-card">
                  <FaStar size="15" color="Orange" />
                  <p className="company-rating">{rating}</p>
                </div>
              </div>
            </div>
            <div className="company-details-card">
              <div className="employment-card">
                <MdLocationOn className="location-icon" />
                <p className="location-type">{location}</p>
                <RiSuitcaseLine className="location-icon" />
                <p className="employment-type">{employmentType}</p>
              </div>
              <div>
                <p className="package-paragraph">{packagePerAnnum}</p>
              </div>
            </div>
            <hr className="hr-line" />
            <div className="description-section">
              <h1 className="description-heading">Description</h1>
              <a className="anchor-tag" href={companyWebsiteUrl}>
                Visit
                <BsBoxArrowUpRight size="15" />
              </a>
            </div>

            <p className="description-paragraph">{jobDescription}</p>
            <h1 className="skills-section">Skills</h1>
            <ul className="skills-unordered-list">
              {skills.map(eachSkill => (
                <li className="skill-list-item" key={eachSkill.name}>
                  <img
                    className="skill-image"
                    src={eachSkill.imageUrl}
                    alt={eachSkill.name}
                  />
                  <p className="skill-name">{eachSkill.name}</p>
                </li>
              ))}
            </ul>
            <h1 className="life-at-company-heading">Life At Company</h1>
            <div className="life-at-company-section">
              <p className="life-at-company-paragraph">
                {lifeAtCompany.description}
              </p>
              <img
                className="life-at-company-image"
                src={lifeAtCompany.imageUrl}
                alt="life at company"
              />
            </div>
          </div>
          <h1 className="similar-job-heading">Similar Jobs</h1>
          <ul className="similar-unordered-list">
            {similarJobsData.map(eachJobItem => (
              <SimilarJobs key={eachJobItem.id} similarJobs={eachJobItem} />
            ))}
          </ul>
        </>
      )
    }
    return null
  }

  renderLoadingView = () => (
    <div className="loader-container">
      <div className="loader-container" data-testid="loader">
        <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
      </div>
    </div>
  )

  renderFinalView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstructor.inProgress:
        return this.renderLoadingView()
      case apiStatusConstructor.failure:
        return this.renderFailureView()
      case apiStatusConstructor.success:
        return this.renderJobDetailsCard()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-details-page-card">{this.renderFinalView()}</div>
      </>
    )
  }
}

export default JobItemDetails
