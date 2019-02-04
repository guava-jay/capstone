import React from 'react'

const About = props => {
  return (
    <div>
      <h1>About Stackbox Games</h1>
      <p>
        StackBox is an online multiplayer game that is created with React and
        Firebase using a mobile first design. The game is targeted toward
        programmers who wish to play with other programmers in the same room and
        test their current knowledge of JavaScript and fundamentals while having
        a good time.
      </p>
      <p>
        Created by Emily McAllister, Eve Mendelevich, Sara Dornblaser, and
        Wingman Lee
      </p>
      <div id="logo-holder">
        <img src="./img/cartoon-box.png" />
      </div>
    </div>
  )
}

export default About
