import { always, compose, equals, gt, invoker, isNil, lte, when, where, unless } from 'ramda'
import React, { Component } from 'react'

const invoke = invoker(0)

const isBestInViewport = where({
  top: lte(0),
  bottom: gt(window.innerHeight),
  width: equals(window.innerWidth)
})

export default class GalleryItem extends Component {
  constructor(props) {
    super(props)
    this.playVideo = this.playVideo.bind(this)
    this.playVideoWithinViewport = this.playVideoWithinViewport.bind(this)
  }

  componentDidMount() {
    window.addEventListener('scroll', this.playVideoWithinViewport)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.playVideoWithinViewport)
  }

  componentDidUpdate() {
    this.playVideoWithinViewport()
  }

  playVideoWithinViewport() {
    unless(
      isNil,
      compose(
        this.playVideo,
        isBestInViewport,
        invoke('getBoundingClientRect')
      ),
      this.video
    )
  }

  playVideo(play) {
    play
      ? this.video.play()
      : this.video.pause()
  }

  playOnHover(play) {
    when(
      Boolean,
      compose(this.playVideo, always(play)),
      this.props.playOnHover
    )
  }

  render() {
    const { item: { animated, link, mp4 }, onLoad } = this.props

    return animated
      ? <video className='gallery-item'
               src={mp4}
               onCanPlayThrough={onLoad}
               ref={video => this.video = video}
               onMouseOver={() => this.playOnHover(true)}
               onMouseOut={() => this.playOnHover(false)}
               autoPlay
               loop
               muted
               playsInline/>
      : <img className='gallery-item' onLoad={onLoad} src={link}/>
  }
}
