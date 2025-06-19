import {Link} from 'react-router-dom'
import {FaStar} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'

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
    <li>
      <Link to={`/jobs/${id}`}>
        <div className="job-card-container">
          <div className="first-line-container">
            <img src={companyLogoUrl} className="logo-image" alt={title} />
            <div>
              <h1>{title}</h1>
              <div className="first-line-bottom-container">
                <FaStar size="10" />
                <p>{rating}</p>
              </div>
            </div>
          </div>
          <div className="second-line-container">
            <div className="second-line-top-container">
              <MdLocationOn size="10" />
              <p>{location}</p>

              <p>{employmentType}</p>
            </div>
            <p>{packagePerAnnum}</p>
          </div>
          <hr className="hr-1" />
          <p>Description</p>
          <p>{jobDescription}</p>
        </div>
      </Link>
    </li>
  )
}
export default JobCard
