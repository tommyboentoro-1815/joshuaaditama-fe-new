import React from "react"
import Slider from "react-slick"
import { IoIosArrowDropright } from 'react-icons/io'
import { IoIosArrowDropleft } from "react-icons/io"
import Footbar from "../../components/Footer"
import "./../../Supports/tiga.css"
import "./../../Supports/home.css"
import "./../../Supports/projectDetail.css"
import "./../../Supports/projectResponsive.css"

const NextArrow = ({ onClick }) => (
  <div className="arrow next" style={{ display: "none" }} onClick={onClick}>
    <IoIosArrowDropright />
  </div>
)

const PrevArrow = ({ onClick }) => (
  <div className="arrow prev" style={{ display: "none" }} onClick={onClick}>
    <IoIosArrowDropleft />
  </div>
)

const sliderSettings = {
  className: "center",
  centerMode: true,
  infinite: true,
  centerPadding: "60px",
  slidesToShow: 1,
  speed: 500,
  autoplay: true,
  dots: true,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
}

function ProjectDetail({ project }) {
  const { title, category, location, year, status, headingDescription, bodyParagraphs, bodyDescriptionTwo, images } = project

  return (
    <>
      <div
        className="backgroundimg"
        style={{ backgroundImage: `url(${images[0]})`, backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center center", overflow: "hidden" }}
      >
        <div className="overlay">
          <div className="container px-md-3 px-sm-0 px-4 d-flex flex-column justify-content-end fontlato" style={{ height: "100%" }}>
            <div className="fontbgheading">{title}</div>
            <div className="paddingbg fontbgbody">
              <div className="row px-sm-0 px-2">
                <div className="col-sm col-6 py-md-0 py-1 d-flex justify-content-md-center justify-content-start">
                  Category: {category}
                </div>
                <div className="col-sm col-6 py-md-0 py-1 d-flex justify-content-md-center justify-content-start">
                  Location: {location}
                </div>
                <div className="col-sm col-6 py-md-0 py-1 d-flex justify-content-md-center justify-content-start">
                  Year: {year}
                </div>
                <div className="col-sm col-6 py-md-0 py-1 d-flex justify-content-md-center justify-content-start">
                  Status: {status}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ overflow: "hidden" }} className="fontlato container px-md-3 px-sm-0 px-4 d-flex flex-column align-items-center marginbodyheading">
        <div className="col-md-10 col-12 fontheading px-md-3 px-sm-0 px-2">
          {headingDescription}
        </div>
        <div className="col-md-10 col-12 fontbody px-md-3 px-sm-0 px-2">
          {bodyParagraphs.map((para, i) => (
            <React.Fragment key={i}>
              {i > 0 && <><br /><br /></>}
              {para}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="marginslick">
        <Slider {...sliderSettings}>
          {images.map((img, i) => (
            <div key={i}>
              <img src={img} className="opacityimage slickheight" alt="" />
            </div>
          ))}
        </Slider>
      </div>

      {bodyDescriptionTwo && (
        <div style={{ overflow: "hidden" }} className="container px-md-3 px-sm-0 px-4 d-flex flex-column align-items-center fontlato">
          <div className="col-md-10 col-12 fontbody-dua px-md-3 px-sm-0 px-2">
            {bodyDescriptionTwo.map((para, i) => (
              <React.Fragment key={i}>
                {i > 0 && <><br /><br /></>}
                {para}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      <Footbar />
    </>
  )
}

export default ProjectDetail
