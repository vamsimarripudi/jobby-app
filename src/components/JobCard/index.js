import {Link} from 'react-router-dom'
import {FaStar} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import {RiSuitcaseLine} from 'react-icons/ri'

import './index.css'

const JobCard = props => {
  const {jobCardDetails} = props
  const {
    id,
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    title,
    rating,
    packagePerAnnum,
  } = jobCardDetails
  return (
    <li className="job-list">
      <Link to={`/jobs/${id}`} className="linked-toggle">
        <div className="job-card-container">
          <div className="first-line-container">
            <img
              src={companyLogoUrl}
              className="logo-image"
              alt="company logo"
            />
            <div className="crd-top">
              <h1 className="job-title">{title}</h1>
              <div className="first-line-bottom-container">
                <FaStar color="orange" size="15" />
                <p className="rating-para">{rating}</p>
              </div>
            </div>
          </div>
          <div className="second-line-container">
            <div className="second-line-top-container">
              <MdLocationOn size="18" />
              <p className="para-location">{location}</p>
              <RiSuitcaseLine font-size="bold" size="18" />
              <p className="employment-para">{employmentType}</p>
            </div>
            <p>{packagePerAnnum}</p>
          </div>
          <hr className="hr-1" />
          <h1 className="card-description">Description</h1>
          <p className="paragraph">{jobDescription}</p>
        </div>
      </Link>
    </li>
  )
}
export default JobCard
