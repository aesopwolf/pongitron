'use strict';
import React from 'react';
import _ from 'lodash';

let switchService = new Audio('assets/audio/switch-service.mp3');
let ping = new Audio('assets/audio/ping.mp3');
let win = new Audio('assets/audio/you-win.mp3');
let deuce = new Audio('assets/audio/deuce.mp3');
let fivedem = new Audio('assets/audio/fivedem.mp3');

let PongBall = class PongBall extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		let playerClass = "player" + (this.props.ltr ? this.props.player : (this.props.player === 1) ? 2 : 1) + " pingpongball";
		if (this.props.swapService) {
			return (<div><div className={playerClass}></div><div className="swapServiceLine"></div></div>)
		} else {
			return (<div className={playerClass}></div>)
		}
	}
}

let Timeline = class Timeline extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		let game = this.props.game;
		let balls = [];
		let ballsDrop = game.scores.length - 40;
		for(var i = (ballsDrop > 0)? ballsDrop : 1; i < game.scores.length; i++) {
			let swapService = (game.scores[i].player1 + game.scores[i].player2) % (game.playingTo === 21 ? 5 : 2) === 0
			let whoScored = (game.scores[i].player1 - game.scores[i-1].player1 === 1) ? 1 : 2;
			balls.push(<PongBall key={i} ltr={game.ltr} player={whoScored} swapService={swapService} />);
		}

		return (
				<div className="timeline">
					{balls}
				</div>
		       )
	}
}

let Player = class Player extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let me = this.props.player === 1 ? 'player1' : 'player2';
    let them = this.props.player === 1 ? 'player2' : 'player1';

    // find the player's score
    let game = this.props.game;
    let currentScore = this.props.game.scores.length - 1;
    let myScore = this.props.player === 1 ? game.scores[currentScore].player1 : game.scores[currentScore].player2

    // decide to color the background or not
    let previousScore = game.scores.length > 1 ? game.scores.length - 2 : game.scores.length - 1;
    let player1active = game.scores[currentScore].player1 !== game.scores[previousScore].player1;
    let player2active = game.scores[currentScore].player2 !== game.scores[previousScore].player2;
    let activeString;

    if(this.props.player == 1 && player1active) {
      activeString = 'player1active'
    }
    if(this.props.player === 2 && player2active) {
      activeString = 'player2active'
    }

    // tally the total points earned during your service
    let tally = [];
    let switchCount = this.props.game.playingTo === 21 ? 5 : 2;
    let goBackX = (game.scores[currentScore].player1 + game.scores[currentScore].player2) % switchCount;
    goBackX = this.props.game.scores.length - 1 - goBackX;
    for(var i = this.props.game.scores.length - 1; i >= goBackX; i--) {
      if(this.props.player === 1) {
        tally.push(this.props.game.scores[i].player1);
      }
      if(this.props.player === 2) {
        tally.push(this.props.game.scores[i].player2);
      }
    }

    // figure out the deuce lettering
    if(game.deuce) {
      if(game.scores[currentScore][me] - game.scores[currentScore][them] === 1) {
        myScore = 'A';
      }
      else if(game.scores[currentScore][me] - game.scores[currentScore][them] === 2) {
        myScore = ':)';
      }
      else if(game.scores[currentScore][me] - game.scores[currentScore][them] === -2) {
        myScore = ':(';
      }
      else {
        myScore = 'D';
      }
    }

    return (
      <div className={"player " + (activeString || 'inactive')}>
        <h1 ref='score'>{myScore}</h1>
        <p>{_.uniq(tally).length - 1}</p>
      </div>
    )
  }
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.counter = 0;
    this.state = {
      playingTo: parseInt(localStorage.getItem('playingTo'), 10) || 21,
      ltr: true,
      scores: [
        {player1: 0, player2: 0}
      ],
      lastPress: Date.now()
    }

    window.addEventListener('keypress', this.handlekeypress.bind(this));
  }

  handlekeypress(e) {
    // prevent user from hitting button too fast
    if(Date.now() - this.state.lastPress < 200) {
      // todo: play error sound
      return;
    }
    this.setState({lastPress: Date.now()})

    // get the last scores
    let newScores = this.state.scores.slice();
    let player1 = newScores[newScores.length - 1].player1;
    let player2 = newScores[newScores.length - 1].player2;

    // add score to player1
    if(e.keyCode === 49) {
      ping.play();
      newScores.push({
        player1: player1 + 1 < 0 ? 0 : player1 + 1,
        player2: player2,
        date: Date.now()
      });
    };

    // minus score from player1
    if(e.keyCode === 50) {
      // can't remove points if no one has any
      if(newScores.length === 1) {
        return;
      }

      // prevent player1 from removing player2 points
      // also prevent player1 from removing their own points if player2 has
      //   has made a point since player1 has
      if(newScores[newScores.length - 1].player1 === newScores[newScores.length - 2].player1) {
        return;
      }

      if(this.state.scores.length > 1) {
        newScores.pop();
      }
    };

    // add score to player2
    if(e.keyCode === 55) {
      ping.play();
      newScores.push({
        player1: player1,
        player2: player2 + 1 < 0 ? 0 : player2 + 1,
        date: Date.now()
      });
    };

    // minus score from player2
    if(e.keyCode === 52) {
      // can't remove points if no one has any
      if(newScores.length === 1) {
        return;
      }

      // prevent player2 from removing player1 points
      // also prevent player2 from removing their own points if player1 has
      //   has made a point since player2 has
      if(newScores[newScores.length - 1].player2 === newScores[newScores.length - 2].player2) {
        return;
      }

      if(this.state.scores.length > 1) {
        newScores.pop();
      }
    };

    // setup new variables for switchService, gameOver, deuce
    let player1new = newScores[newScores.length - 1].player1;
    let player2new = newScores[newScores.length - 1].player2;
    let switchCount = this.state.playingTo === 21 ? 5 : 2;
    let deuceGame;

    // deuce
    if(player1new === this.state.playingTo - 1 && player2new === this.state.playingTo - 1) {
      deuce.play();
      this.setState({scores: newScores, deuce: true});
      return;
    }

    var newScoresHead = newScores.length - 1;
    var player1Streak = newScores[newScoresHead].player1 -
        newScores[(newScoresHead >= 5) ? newScoresHead - 5 : 0].player1;
    var player2Streak = newScores[newScoresHead].player2 -
        newScores[(newScoresHead >= 5) ? newScoresHead - 5 : 0].player2;

    // play sound to switch service
    if ((player1new === 0 && player2new === 0) || this.state.deuce) {
        // do nothing
    }
    else if ((player1new + player2new) % switchCount === 0) {
        if (player1Streak == 5 || player2Streak == 5) {
            fivedem.play();
        }
        else {
            switchService.play();
        }
    }

    // normal game over
    if(this.state.deuce) {
      // do nothing
    }
    else if(player1new === this.state.playingTo || player2new === this.state.playingTo) {
      // todo: save game to localstorage
      // todo: show replay screen
      win.play();
      newScores = [{
        player1: 0,
        player2: 0
      }];
    }

    if(this.state.deuce && Math.abs(player1new - player2new) === 2) {
      win.play();
    }
    if(this.state.deuce && Math.abs(player1new - player2new) === 3) {
      newScores = [{
        player1: 0,
        player2: 0
      }];
      this.setState({scores: newScores, deuce: false});
      return;
    }

    this.setState({scores: newScores})
  }

  changePlayingTo(event) {
    this.setState({
      playingTo: this.state.playingTo === 21 ? 11 : 21,
      scores: [{
        player1: 0,
        player2: 0
      }]
    });

    localStorage.setItem('playingTo', this.state.playingTo === 21 ? 11 : 21);
  }

  changeScoreCardSides() {
    this.setState({
      ltr: !this.state.ltr
    })
  }

  render() {
    let toEleven = this.state.playingTo === 11 ? true : false;

    return (
      <div>
        <header>
          <button onClick={this.changeScoreCardSides.bind(this)}>Swap</button>
        </header>
        <div className='table'>
          <div className='table-row'>
            <Player game={this.state} player={this.state.ltr ? 1 : 2} />
	    <Timeline game={this.state} />
            <Player game={this.state} player={this.state.ltr ? 2 : 1} />
          </div>
        </div>
        <footer>
          <input className='tgl tgl-flat' id='cb4' type='checkbox' defaultChecked={toEleven} />
          <label className='tgl-btn' htmlFor='cb4' onClick={this.changePlayingTo.bind(this)}></label>
        </footer>
      </div>
    );
  }
}
