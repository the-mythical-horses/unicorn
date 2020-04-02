/* eslint-disable react/button-has-type */
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import history from './../history';
import {Link} from 'react-router-dom';
import wdk from 'wikidata-sdk';
import sparqljs from 'sparqljs';
import axios from 'axios';
import M from 'materialize-css';
import {CompareDisplay} from './index.js';

/**
 * COMPONENT
 */
export class UserHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {result: []};
  }

  componentDidMount() {
    M.AutoInit();
  }

  render() {
    const {email} = this.props;
    return (
      <div id="featured">
        <div id="welcome-div">
          <div id="welcome" className="welcome-div">
            <div id="welcome-text1">
              <h5>
                Welcome to <Link to="/">Unicorn</Link>
              </h5>
              <h6>
                the free <Link to="/compare">comparative</Link> engine that
                anyone can use
              </h6>
            </div>
          </div>
        </div>
        <div id="did-you-know" className="featured-divs">
          <div id="did-you-know-header">
            <h6>
              <b>Did you know...</b>
            </h6>
          </div>
          <div id="section2-content">
            <div id="dyn-column1">
              <ul>
                <li className="dyn-li">
                  ● ...that{' '}
                  <a href="https://www.wikidata.org/wiki/Q1929542">
                    Gary the Snail
                  </a>{' '}
                  (from{' '}
                  <a href="https://www.wikidata.org/wiki/Q83279">
                    Sponge Bob Square Pants
                  </a>
                  ) is cousins with{' '}
                  <a href="https://www.wikidata.org/wiki/Q1077456">
                    {' '}
                    Patrick Star
                  </a>
                  ?
                </li>
                <li className="dyn-li">
                  ● ...that{' '}
                  <a href="https://www.wikidata.org/wiki/Q2263">Tom Hanks</a>{' '}
                  (american actor) and his spouse,{' '}
                  <a href="https://www.wikidata.org/wiki/Q234144">
                    Rita Wilson
                  </a>{' '}
                  (american actress), have both been diagnosed with COVID-19?
                </li>
                <li className="dyn-li">
                  ● ...that{' '}
                  <a href="https://www.wikidata.org/wiki/Q12379">Mario</a> and{' '}
                  <a href="https://www.wikidata.org/wiki/Q210593">Luigi</a>{' '}
                  (from the popular video game) share the same last name:
                  "Mario"?
                </li>
              </ul>
            </div>
            <div id="dyn-column2">
              <ul>
                <li className="dyn-li">● ...that ?</li>
                <li className="dyn-li">
                  ● ...that here goes a did you knowhere goes a did you know.
                  here goes a did you know. here goes a did you know. here goes
                  a did you know.
                </li>
                <li className="dyn-li">
                  ● ...that here goes a did you knowhere goes a did you know.
                  here goes a did you know. here goes a did you know. here goes
                  a did you know.
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div id="featured-comparison" className="featured-divs">
          <div id="featComp-header">
            <h6>
              <b>Today's featured comparison</b>
            </h6>
          </div>
          <div id="featComp-content">
            <div id="featComp-content-boxes">
              <div className="elisCard smallCards" id="leftCard">
                <div className="smallTitleLeft">Tom Hanks</div>
                <div className="smallSubTitle">American actor and producer</div>
                <img
                  className="compare-img"
                  src="https://upload.wikimedia.org/wikipedia/commons/d/d0/TomHanksJan2009.jpg"
                />
                <div className="smallPictureDescription">
                  <a
                    href="https://en.wikipedia.org/wiki/Tom_Hanks"
                    className="extiw"
                    title="en:Tom Hanks"
                  >
                    Tom Hanks
                  </a>{' '}
                  recites the orchestral work "Lincoln Portrait," written by
                  Aaron Copland, at the Lincoln Memorial on the National Mall in
                  Washington, D.C., January 18, 2009, during the inaugural
                  opening ceremonies. More than 5,000 men and women in uniform
                  are providing military ceremonial support to the presidential
                  inauguration for Barack Obama, a tradition dating back to
                  George Washington's 1789 inauguration.
                </div>
                <div className="smallInfo">
                  <div className="smallInfoTitleLeft">Information</div>
                  <div className="smallInfoMain">
                    <div className="theSmalls">
                      <div className="smallInfoH">Commons category</div>
                      <div className="smallInfoD">Tom Hanks</div>
                    </div>
                    <div className="theSmalls">
                      <div className="smallInfoH">VIAF ID</div>
                      <div className="smallInfoD">19874894</div>
                    </div>
                    <div className="theSmalls">
                      <div className="smallInfoH">
                        International Standard Name Identifier
                      </div>
                      <div className="smallInfoD">0000 0001 2123 2378</div>
                    </div>
                    <div className="theSmalls">
                      <div className="smallInfoH">occupation</div>
                      <div className="smallInfoD">
                        film actor, film director, actor, film producer, writer,
                        voice actor, screenwriter, composer, character actor,
                        television actor, television director, television
                        producer
                      </div>
                    </div>
                    <div className="theSmalls">
                      <div className="smallInfoH">country of citizenship</div>
                      <div className="smallInfoD">
                        United States of America, Greece
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="elisCard bigCards">
                <div className="bigTitle">How They Compare:</div>
                <div className="levelHeader">
                  <div className="levelHeader-text">Level 1</div>
                  <div />
                </div>
                <ol>
                  <li>
                    <span className="twoProp">occupation: </span>film actor,
                    actor, film producer, television actor
                  </li>
                  <li>
                    <span className="twoProp">country of citizenship: </span>
                    United States of America, Greece
                  </li>
                  <li>
                    <span className="twoProp">instance of: </span>human
                  </li>
                  <li>
                    <span className="twoProp">child: </span>Chet Hanks, Truman
                    Hanks
                  </li>
                  <li>
                    <span className="twoProp">medical condition: </span>COVID-19
                  </li>
                  <li>
                    <span className="twoProp">religion: </span>Orthodox
                    Christianity
                  </li>
                  <li>
                    <span className="twoProp">
                      languages spoken, written or signed:{' '}
                    </span>
                    English
                  </li>
                  <li>
                    <span className="twoProp">described by source: </span>Obalky
                    knih.cz
                  </li>
                </ol>
                <div className="levelHeader">
                  <div className="levelHeader-text">Level 2</div>
                  <div />
                </div>
                <ol>
                  <li>
                    <span className="twoProp">
                      <span>occupation (</span>
                      <a
                        href="https://www.wikidata.org/wiki/Q36834"
                        className="leftLabel"
                      >
                        composer
                      </a>
                      ,{' '}
                      <a
                        href="https://www.wikidata.org/wiki/Q177220"
                        className="rightLabel"
                      >
                        singer
                      </a>
                      ):{' '}
                    </span>
                    <ol>
                      <li>instance of: musical profession</li>
                      <li>ROME Occupation Code (v3): L1202</li>
                    </ol>
                  </li>
                  <li>
                    <span className="twoProp">
                      <span>sex or gender (</span>
                      <a
                        href="https://www.wikidata.org/wiki/Q6581097"
                        className="leftLabel"
                      >
                        male
                      </a>
                      ,{' '}
                      <a
                        href="https://www.wikidata.org/wiki/Q6581072"
                        className="rightLabel"
                      >
                        female
                      </a>
                      ):{' '}
                    </span>
                    <ol>
                      <li>instance of: gender identity, sex of humans</li>
                    </ol>
                  </li>
                  <li>
                    <span className="twoProp">
                      <span>place of birth (</span>
                      <a
                        href="https://www.wikidata.org/wiki/Q490441"
                        className="leftLabel"
                      >
                        Concord
                      </a>
                      ,{' '}
                      <a
                        href="https://www.wikidata.org/wiki/Q34006"
                        className="rightLabel"
                      >
                        Hollywood
                      </a>
                      ):{' '}
                    </span>
                    <ol>
                      <li>country: United States of America</li>
                    </ol>
                  </li>
                  <li>
                    <span className="twoProp">
                      <span>spouse (</span>
                      <a
                        href="https://www.wikidata.org/wiki/Q234144"
                        className="leftLabel"
                      >
                        Rita Wilson
                      </a>
                      ,{' '}
                      <a
                        href="https://www.wikidata.org/wiki/Q2263"
                        className="rightLabel"
                      >
                        Tom Hanks
                      </a>
                      ):{' '}
                    </span>
                    <ol>
                      <li>
                        occupation: television actor, film actor, actor, film
                        producer
                      </li>
                      <li>
                        country of citizenship: United States of America, Greece
                      </li>
                      <li>instance of: human</li>
                      <li>child: Chet Hanks, Truman Hanks</li>
                      <li>described by source: Obalky knih.cz</li>
                      <li>languages spoken, written or signed: English</li>
                      <li>medical condition: COVID-19</li>
                      <li>religion: Orthodox Christianity</li>
                    </ol>
                  </li>
                  <li>
                    <span className="twoProp">
                      <span>given name (</span>
                      <a
                        href="https://www.wikidata.org/wiki/Q3354498"
                        className="leftLabel"
                      >
                        Tom
                      </a>
                      ,{' '}
                      <a
                        href="https://www.wikidata.org/wiki/Q6760124"
                        className="rightLabel"
                      >
                        Margarita
                      </a>
                      ):{' '}
                    </span>
                    <ol>
                      <li>writing system: Latin script</li>
                      <li>language of work or name: Dutch</li>
                      <li>
                        attested in: frequency of first names in the
                        Netherlands, 2010
                      </li>
                    </ol>
                  </li>
                  <li>
                    <span className="twoProp">
                      <span>given name (</span>
                      <a
                        href="https://www.wikidata.org/wiki/Q3354498"
                        className="leftLabel"
                      >
                        Tom
                      </a>
                      ,{' '}
                      <a
                        href="https://www.wikidata.org/wiki/Q1094218"
                        className="rightLabel"
                      >
                        Rita
                      </a>
                      ):{' '}
                    </span>
                    <ol>
                      <li>writing system: Latin script</li>
                      <li>language of work or name: Dutch</li>
                      <li>
                        attested in: frequency of first names in the
                        Netherlands, 2010
                      </li>
                    </ol>
                  </li>
                  <li>
                    <span className="twoProp">
                      <span>ethnic group (</span>
                      <a
                        href="https://www.wikidata.org/wiki/Q3267812"
                        className="leftLabel"
                      >
                        Portuguese American
                      </a>
                      ,{' '}
                      <a
                        href="https://www.wikidata.org/wiki/Q1150312"
                        className="rightLabel"
                      >
                        Greek American
                      </a>
                      ):{' '}
                    </span>
                    <ol>
                      <li>instance of: ethnic group</li>
                    </ol>
                  </li>
                  <li>
                    <span className="twoProp">
                      <span>ethnic group (</span>
                      <a
                        href="https://www.wikidata.org/wiki/Q3267812"
                        className="leftLabel"
                      >
                        Portuguese American
                      </a>
                      ,{' '}
                      <a
                        href="https://www.wikidata.org/wiki/Q4996183"
                        className="rightLabel"
                      >
                        Bulgarian Americans
                      </a>
                      ):{' '}
                    </span>
                    <ol>
                      <li>instance of: ethnic group</li>
                    </ol>
                  </li>
                  <li>
                    <span className="twoProp">
                      <span>ethnic group (</span>
                      <a
                        href="https://www.wikidata.org/wiki/Q3267812"
                        className="leftLabel"
                      >
                        Portuguese American
                      </a>
                      ,{' '}
                      <a
                        href="https://www.wikidata.org/wiki/Q539051"
                        className="rightLabel"
                      >
                        Greeks
                      </a>
                      ):{' '}
                    </span>
                    <ol>
                      <li>instance of: ethnic group</li>
                    </ol>
                  </li>
                  <li>
                    <span className="twoProp">
                      <span>ethnic group (</span>
                      <a
                        href="https://www.wikidata.org/wiki/Q4969441"
                        className="leftLabel"
                      >
                        British American
                      </a>
                      ,{' '}
                      <a
                        href="https://www.wikidata.org/wiki/Q1150312"
                        className="rightLabel"
                      >
                        Greek American
                      </a>
                      ):{' '}
                    </span>
                    <ol>
                      <li>instance of: ethnic group</li>
                    </ol>
                  </li>
                  <li>
                    <span className="twoProp">
                      <span>ethnic group (</span>
                      <a
                        href="https://www.wikidata.org/wiki/Q4969441"
                        className="leftLabel"
                      >
                        British American
                      </a>
                      ,{' '}
                      <a
                        href="https://www.wikidata.org/wiki/Q4996183"
                        className="rightLabel"
                      >
                        Bulgarian Americans
                      </a>
                      ):{' '}
                    </span>
                    <ol>
                      <li>instance of: ethnic group</li>
                    </ol>
                  </li>
                  <li>
                    <span className="twoProp">
                      <span>ethnic group (</span>
                      <a
                        href="https://www.wikidata.org/wiki/Q4969441"
                        className="leftLabel"
                      >
                        British American
                      </a>
                      ,{' '}
                      <a
                        href="https://www.wikidata.org/wiki/Q539051"
                        className="rightLabel"
                      >
                        Greeks
                      </a>
                      ):{' '}
                    </span>
                    <ol>
                      <li>instance of: ethnic group</li>
                    </ol>
                  </li>
                  <li>
                    <span className="twoProp">
                      <span>family name (</span>
                      <a
                        href="https://www.wikidata.org/wiki/Q41712222"
                        className="leftLabel"
                      >
                        Hanks
                      </a>
                      ,{' '}
                      <a
                        href="https://www.wikidata.org/wiki/Q1645480"
                        className="rightLabel"
                      >
                        Wilson
                      </a>
                      ):{' '}
                    </span>
                    <ol>
                      <li>instance of: family name</li>
                      <li>language of work or name: English</li>
                      <li>writing system: Latin script</li>
                    </ol>
                  </li>
                </ol>
              </div>
              <div className="elisCard smallCards" id="rightCard">
                <div className="smallTitleRight">Rita Wilson</div>
                <div className="smallSubTitle">
                  American actress and producer
                </div>
                <img
                  className="compare-img"
                  src="https://upload.wikimedia.org/wikipedia/commons/e/e4/RitaWilsonHWOFSept2012.jpg"
                />
                <div className="smallPictureDescription" />
                <div className="smallInfo">
                  <div className="smallInfoTitleRight">Information</div>
                  <div className="smallInfoMain">
                    <div className="theSmalls">
                      <div className="smallInfoH">sex or gender</div>
                      <div className="smallInfoD">female</div>
                    </div>
                    <div className="theSmalls">
                      <div className="smallInfoH">Commons category</div>
                      <div className="smallInfoD">Rita Wilson</div>
                    </div>
                    <div className="theSmalls">
                      <div className="smallInfoH">occupation</div>
                      <div className="smallInfoD">
                        television actor, film actor, actor, film producer,
                        singer
                      </div>
                    </div>
                    <div className="theSmalls">
                      <div className="smallInfoH">VIAF ID</div>
                      <div className="smallInfoD">76527201</div>
                    </div>
                    <div className="theSmalls">
                      <div className="smallInfoH">MusicBrainz artist ID</div>
                      <div className="smallInfoD">
                        beb68abb-51b4-41d1-9645-d0c8306cf588
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    email: state.user.email
  };
};

export default connect(mapState)(UserHome);

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  email: PropTypes.string
};
