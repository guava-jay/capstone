import React from 'react'
import {Link} from 'react-router-dom'

const About = () => {
  return (
    <div className="display-static">
      <h2>About Stackbox Games</h2>
      <p className="about-text">
        StackBox is an online multiplayer game that is created with React and
        Firebase using a mobile first design. The game is targeted toward
        programmers who wish to play with other programmers in the same room and
        test their current knowledge of JavaScript and fundamentals while having
        a good time.
      </p>
      <h3 className="about-text">
        Created by Emily McAllister, Eve Mendelevich, Sara Dornblaser, and
        Wingman Lee
      </h3>
      <Link to="/">
        <button className="button6 buttonHome" type="button">
          <h4>Back to home</h4>
        </button>
      </Link>
      <div id="logo-holder">
        <img src="./img/cartoon-box.png" />
      </div>
    </div>
  )
}

export default About
