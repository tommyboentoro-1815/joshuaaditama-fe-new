import React from "react"
import axios from "axios"

import "./../Supports/home.css"
import "./../Supports/projectResponsive.css"

import Footbar from "../components/Footer"

class Project extends React.Component {

  state = { apiProjects: [] }

  componentDidMount() {
    axios.get(`${process.env.REACT_APP_API_URL}/projects`)
      .then(res => this.setState({ apiProjects: res.data }))
      .catch(() => {})
  }

  render() {
    const { apiProjects } = this.state
    const colSizes = ['col-sm-9', 'col-sm-3', 'col-sm-3', 'col-sm-6']
    const imgClasses = ['imagecol-9', 'imagecol-3', 'imagecol-3', 'imagecol-6']

    return (
      <>
        <div className="bgproject bgimageresponsive">
          <div className="overlay">
            <div className="container px-md-3 px-sm-0 px-4 fontlato" style={{height:"100%", color:"white"}}>
              <div className="d-flex flex-column justify-content-end px-md-0 px-sm-3 px-2" style={{height:"100%"}}>
                <div className="fontbgproject" style={{fontWeight:"300", letterSpacing:"0.015cm"}}>
                  Projects
                </div>
                <div className="linebgproject"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="container px-md-3 px-sm-4 px-5">
          <div className="row">
            {apiProjects.map((p, index) => {
              const col = colSizes[index % colSizes.length]
              const img = imgClasses[index % imgClasses.length]
              return (
                <div key={p._id} className={`${col} px-md-3 px-sm-1 px-0 image imagehover paddingbody`}>
                  <div style={{overflow:"hidden"}}>
                    <a href={`/${p.slug}`}>
                      <img src={p.images[0]} alt={p.title} className={img} />
                    </a>
                  </div>
                  <div className="margincardbody">
                    <div className="fontcategory">{p.category}</div>
                    <div className="fonttitle">{p.title}</div>
                    <div className="col-md-8 col-12 px-0 fontbodyproject">{p.headingDescription}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <Footbar />
      </>
    )
  }
}

export default Project
