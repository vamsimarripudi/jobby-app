import {RiSuitcaseLine} from 'react-icons/ri'
import {IoLocationOutline, IoStar} from 'react-icons/io5'

import './index.css'

const SimilarJobs = props => {
  const {similarJobs} = props
  const {
    companyLogoUrl,
    title,
    jobDescription,
    employmentType,
    rating,
    location,
  } = similarJobs

  return (
    <li className="similar-job-card">
      <div>
        <div className="similar-job-top-card">
          <img
            className="company-logo"
            src={companyLogoUrl}
            alt="similar job company logo"
          />
          <div className="job-card-middle">
            <h1 className="company-title">{title}</h1>
            <div className="location-card-middle">
              <IoStar className="job-rating-icon" color="orange" size="15" />
              <p className="job-card-rating">{rating}</p>
            </div>
          </div>
        </div>
        <div>
          <h1 className="description">Description</h1>
          <p className="description-sm">{jobDescription}</p>
        </div>
        <div>
          <div className="job-middle-start">
            <IoLocationOutline size="20" color="#f1f5f9" />
            <p className="location-title">{location}</p>
            <RiSuitcaseLine size="20" color="#f1f5f9" />
            <p className="location-title">{employmentType}</p>
          </div>
        </div>
      </div>
    </li>
  )
}

export default SimilarJobs
