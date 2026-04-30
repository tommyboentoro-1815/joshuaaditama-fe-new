import React from "react"
import Slider from "react-slick"
import axios from "axios"
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import Footbar from "../components/Footer";
import {IoIosArrowDropright} from 'react-icons/io';
import {IoIosArrowDropleft} from "react-icons/io"

import "./../Supports/home.css"
import "./../Supports/homeresponsive.css"
import "./../Supports/empat.css"
import "./../Supports/responsive.css"
import "./../Supports/animations.css"

const NextArrow1 = ({ onClick }) => (
  <div className="arrow next" style={{display:"none"}} onClick={onClick}>
    <IoIosArrowDropright />
  </div>
)

const PrevArrow1 = ({ onClick }) => (
  <div className="arrow prev" style={{display:"none"}} onClick={onClick}>
    <IoIosArrowDropleft />
  </div>
)

const PrevArrow = ({ onClick }) => (
  <div onClick={onClick}>
    <ul className="ularrowPrev">
      <li className="arrowPrev"><span></span></li>
    </ul>
  </div>
)

const NextArrow = ({ onClick }) => (
  <div onClick={onClick}>
    <ul className="ularrowNext">
      <li className="arrowNext"><span></span></li>
    </ul>
  </div>
)

class Home extends React.Component {

  state = {
    hoverBg: null,
    prevHoverBg: null,
    slideKey: 0,
    featuredProjects: [],
  }

  componentDidMount() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            this.observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )
    this.observeScrollElements()
    this.fetchFeatured()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.featuredProjects !== this.state.featuredProjects) {
      this.observeScrollElements()
    }
  }

  componentWillUnmount() {
    if (this.observer) this.observer.disconnect()
  }

  observeScrollElements = () => {
    document.querySelectorAll('.scroll-reveal:not(.visible)').forEach(el => {
      this.observer.observe(el)
    })
  }

  fetchFeatured = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/projects`)
      .then(res => {
        const all = res.data
        const featured = all.filter(p => p.featured)
        const display = featured.length > 0 ? featured.slice(0, 3) : all.slice(0, 3)
        this.setState({
          featuredProjects: display,
          hoverBg: display.length > 0 ? display[0].images[0] : null,
        })
      })
      .catch(() => {})
  }

  render() {
    const { hoverBg, prevHoverBg, slideKey, featuredProjects } = this.state

    const settings1 = {
      autoplay: true,
      slideToShow: 1,
      slideToScroll: 1,
      fade: true,
      dots: true,
      dotsClass: "slickDots-home",
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />,
      arrow: false,
      afterChange: () => this.setState(prev => ({ slideKey: prev.slideKey + 1 }))
    }

    const settings2 = {
      autoplay: true,
      slideToShow: 1,
      slideToscroll: 1,
      fade: true,
      dots: false,
      nextArrow: <NextArrow1 />,
      prevArrow: <PrevArrow1 />
    }

    return (
      <>
        {/* ── HERO SLIDER ── */}
        <div className="hero-container">
          {featuredProjects.length > 0 ? (
            <Slider {...settings1}>
              {featuredProjects.map((project, slideIndex) => (
                <div key={project._id}>
                  <div className="opacitySlider"></div>
                  <div className="sliderDots">
                    <div className="textDots fontlato" key={slideKey + slideIndex * 10}>
                      {featuredProjects.map((p, i) => (
                        <div key={p._id} className="col" style={{ opacity: i === slideIndex ? 1 : 0.5 }}>
                          {p.title}
                        </div>
                      ))}
                    </div>
                  </div>
                  <img src={project.images[0]} alt={project.title} className="bgsliderhome" />
                </div>
              ))}
            </Slider>
          ) : (
            <div style={{ height: '100vh', background: '#111' }} />
          )}
        </div>

        {/* ── ABOUT US ── */}
        <div className="container px-md-3 px-sm-0 px-3 marginhome d-flex justify-content-center scroll-reveal">
          <div className="col-sm-10 col-12 px-md-3 px-sm-0 px-3">
            <div className="col-md px-md-3 px-sm-0 px-0">
              <div className="fontlato fontAbout">ABOUT US</div>
              <div className="fontlato col-md-8 col-12 px-0 fontHeadingHome">
                Turning spatial experience into a work of art
              </div>
              <div className="fontlato col-12 col-sm-11 px-0 fontHomeBody">
                Joshua Aditama + partners is a multidiciplinary design studio which focused on spatial experience.
                We create a connection between art and human to experience interior and architectural spaces.
                From commercial to personal spaces drive us to explore the specialty of each projects as works of art.
                Brief, concept, and design implementation give a particular excitement for us to be explored together with you.
              </div>
              <div className="d-flex fontReadMore">
                <div>
                  <a href="/studio" style={{color:"black"}}>Read More</a>
                </div>
                <div style={{marginLeft:"15px"}}>
                  <a style={{color:"black"}} href="/studio"><IoIosArrowDropright/></a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── PROJECTS HEADING ── */}
        <div className="container marginproject scroll-reveal">
          <div className="d-flex justify-content-center fontprojecthome">
            Projects
          </div>
        </div>

        {/* ── PROJECT HOVER CARDS (desktop) ── */}
        {featuredProjects.length > 0 && (
          <div className="hoverHomeNonMobile scroll-reveal">
            <div
              className={`imagehoverproject fontlato${(hoverBg || prevHoverBg) ? ' has-bg' : ''}`}
              style={{position:"relative", overflow:"hidden"}}
            >
              {prevHoverBg && (
                <div
                  className="backgroundhover-bg backgroundhover-bg--out"
                  style={{backgroundImage:`url(${prevHoverBg})`}}
                  onAnimationEnd={() => this.setState({ prevHoverBg: null })}
                />
              )}
              {hoverBg && (
                <div
                  key={hoverBg}
                  className="backgroundhover-bg"
                  style={{backgroundImage:`url(${hoverBg})`}}
                />
              )}
              <div style={{position:"relative", zIndex:1, height:"100%"}}>
                <ul className="listhover" style={{padding:"0", margin:"0", display:"flex", listStyle:"none"}}>
                  {featuredProjects.map(p => (
                    <li
                      key={p._id}
                      className="col d-flex align-items-end borderhover border"
                      style={{padding:"0", margin:"0"}}
                      onMouseEnter={() => this.setState(prev => ({ prevHoverBg: prev.hoverBg, hoverBg: p.images[0] }))}
                    >
                      <a href={`/${p.slug}`} style={{width:"100%"}}>
                        <div className="hoversaya d-flex justify-content-start px-5 align-items-center projectcardheight">
                          <div>
                            <div className="fonthoverheading">{p.category}</div>
                            <div className="fonthoverbody">{p.title}</div>
                          </div>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ── PROJECT SLIDER (mobile) ── */}
        {featuredProjects.length > 0 && (
          <div className="hoverHomeMobile">
            <Slider {...settings2}>
              {featuredProjects.map(p => (
                <div key={p._id} className="border">
                  <a href={`/${p.slug}`}>
                    <div className="textSliderMobile-home fontlato">
                      <div style={{fontSize:"13px", fontWeight:"700"}}>{p.category}</div>
                      <div style={{fontSize:"21px", fontWeight:"300"}}>{p.title}</div>
                    </div>
                  </a>
                  <div><img src={p.images[0]} className="bgSliderMobile-home" alt={p.title}/></div>
                </div>
              ))}
            </Slider>
          </div>
        )}

        {/* ── VIEW MORE BUTTON ── */}
        <div className="d-flex justify-content-center marginbuttonhome scroll-reveal">
          <a href="/project">
            <button
              className="fontlato btn-11"
              style={{width:"119px", height:"52px", borderRadius:"40px", fontSize:"13px", fontWeight:"normal", border:"1px solid black"}}
            >
              View More
            </button>
          </a>
        </div>

        {/* ── SERVICES ── */}
        <div className="container px-md-3 px-sm-0 px-3 d-flex flex-column fontlato align-items-center marginservicehome">
          <div className="fontservice-studio scroll-reveal" style={{fontWeight:"400"}}>
            Services
          </div>
          <div className="col-md-12 col-lg-10 col-12 px-md-3 px-sm-0 px-2 margintopcard">
            <div className="col d-sm-flex px-md-3 px-sm-0 px-2">
              <div className="col-md-6 px-md-3 px-sm-0 px-0 scroll-reveal scroll-reveal-delay-1">
                <div style={{fontSize:"16px", fontWeight:"700"}}>01.</div>
                <div className="textcard-heading mt-1" style={{fontWeight:"300"}}>Design Concultancy</div>
                <div className="col-md-6 col-9 mt-md-4 mt-3 garis"></div>
                <div className="textcard-body mt-md-4 mt-3" style={{color:"#8F8F8F", letterSpacing:"0.025cm"}}>
                  As an interior-architecture design studio, we will provide integrated design process for prospective clients.
                  From brief-based ideas, design concept, design implementation, to construction drawing and details are executed as a design
                  language that is very content and unique for each projects.
                </div>
              </div>
              <div className="col-sm-6 margincard ml-md-5 px-md-3 px-sm-2 px-0 scroll-reveal scroll-reveal-delay-2">
                <div style={{fontSize:"16px", fontWeight:"700"}}>02.</div>
                <div className="textcard-heading mt-1" style={{fontWeight:"300"}}>Design & Build</div>
                <div className="col-md-6 col-9 mt-md-4 mt-3 garis"></div>
                <div className="textcard-body mt-md-4 mt-3" style={{color:"#8F8F8F", letterSpacing:"0.025cm"}}>
                  Providing a one-stop building solution for prospective clients in various scale.
                  With a strong design language and on-site experiences, we are ready to work simultaneously
                  with our competent and experienced partners.
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footbar/>
      </>
    )
  }
}

export default Home
