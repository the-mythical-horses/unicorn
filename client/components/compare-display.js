/* eslint-disable guard-for-in */
/* eslint-disable max-statements */
/* eslint-disable complexity */
import React from 'react';
import wdk from 'wikidata-sdk';
import {connect} from 'react-redux';
import axios from 'axios';
import {Comments} from './index';

class CompareDisplay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      levelOneInfo: false,
      levelTwoInfo: false
    };
  }

  render() {
    let results = this.props.results;
    let l2results = this.props.l2results;

    let left = this.props.left;
    let right = this.props.right;
    let leftImage = this.props.leftImage;
    let leftImageDesc = this.props.leftImageDesc;
    let rightImage = this.props.rightImage;
    let rightImageDesc = this.props.rightImageDesc;

    return (
      <div>
        <div id="elisCards">
          <div className="elisCard smallCards" id="leftCard">
            <div className="smallTitleLeft">
              {left.labels ? left.labels.en : ''}
            </div>
            <div className="smallSubTitle">
              {left.descriptions ? left.descriptions.en : ''}
            </div>
            <img className="compare-img" src={leftImage} />
            <div
              className="smallPictureDescription"
              dangerouslySetInnerHTML={{__html: leftImageDesc}}
            ></div>
            <div className="smallInfo">
              <div className="smallInfoTitleLeft">Information</div>
              <div className="smallInfoMain">
                {left.claims &&
                  Object.keys(left.claims)
                    .slice(0, 5)
                    .map(c => (
                      <div className="theSmalls" key={c}>
                        <div className="smallInfoH">
                          {this.props.getLabel(c)}
                        </div>
                        <div className="smallInfoD">
                          {left.claims[c]
                            .map(v => this.props.getLabel(v.value))
                            .join(', ')}
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          </div>

          <div className="elisCard bigCards">
            <div className="bigTitle">How They Compare:</div>
            <div className="levelHeader">
              <div className="levelHeader-text">Level 1</div>
              <button
                className="levelHeader-btn"
                id="level-1-info-btn"
                type="button"
                onClick={() => {
                  this.setState({
                    levelOneInfo: !this.state.levelOneInfo
                  });
                }}
              >
                ?
              </button>
              {this.state.levelOneInfo ? (
                <div className="level-info">
                  Level 1 output is the result of searching through all the
                  shared properties of the two objects and returning the all the
                  shared values
                </div>
              ) : (
                <div></div>
              )}
            </div>
            <ol>
              {Object.keys(results).map(p => (
                <li key={p}>
                  <span className="twoProp">{`${this.props.getLabel(
                    p
                  )}: `}</span>
                  {results[p].map((q, i) => (
                    <span key={q}>
                      <a href={`https://www.wikidata.org/wiki/${q}`}>
                        {this.props.getLabel(q)}
                      </a>
                      {i !== results[p].length - 1 ? (
                        <span>, </span>
                      ) : (
                        <span></span>
                      )}
                    </span>
                  ))}
                </li>
              ))}
            </ol>
            <div className="levelHeader">
              <div className="levelHeader-text">Level 2</div>
              <button
                className="levelHeader-btn"
                id="level-2-info-btn"
                type="button"
                onClick={() => {
                  this.setState({
                    levelTwoInfo: !this.state.levelTwoInfo
                  });
                }}
              >
                ?
              </button>
              {this.state.levelTwoInfo ? (
                <div className="level-info">
                  Level 2 output is the result of a 2 step proccess. First we
                  compile a list of shared properties with unshared values (e.g.
                  they may both have a birthplace, but their not the same
                  places). Then, we find all the shared properties of those
                  values and return the ones that have shared values. For
                  example, suppose we were object1's birthplace was America and
                  object2's birthplace was Armenia. Since the values of the
                  birthplace property are different it would not show up on
                  level 1. But both of theses countries have a property called
                  'hasQuality', and by both that property has the value of 'free
                  country' so this would be under the level 2 results.
                </div>
              ) : (
                <div></div>
              )}
            </div>
            <ol>
              {Object.keys(l2results).map(p => (
                <li key={p}>
                  <span className="twoProp">
                    <span>
                      {`${this.props.getLabel(l2results[p].key[0])} (`}
                    </span>
                    <a
                      href={`https://www.wikidata.org/wiki/${l2results[p].key[1]}`}
                      className="leftLabel"
                    >
                      {`${this.props.getLabel(l2results[p].key[1])}`}
                    </a>
                    {`, `}
                    <a
                      href={`https://www.wikidata.org/wiki/${l2results[p].key[2]}`}
                      className="rightLabel"
                    >
                      {`${this.props.getLabel(l2results[p].key[2])}`}
                    </a>
                    {`): `}
                  </span>
                  <ol>
                    {Object.keys(l2results[p].results).map(p2 => (
                      <li key={p2}>
                        <b>{this.props.getLabel(p2)}:</b>{' '}
                        {l2results[p].results[p2].map((q, i) => (
                          <span key={q}>
                            <a href={`https://www.wikidata.org/wiki/${q}`}>
                              {this.props.getLabel(q)}
                            </a>
                            {i !== l2results[p].results[p2].length - 1 ? (
                              <span>, </span>
                            ) : (
                              <span></span>
                            )}
                          </span>
                        ))}
                      </li>
                    ))}
                  </ol>
                </li>
              ))}
            </ol>
          </div>

          <div className="elisCard smallCards" id="rightCard">
            <div className="smallTitleRight">
              {right.labels ? right.labels.en : ''}
            </div>
            <div className="smallSubTitle">
              {right.descriptions ? right.descriptions.en : ''}
            </div>
            <img className="compare-img" src={rightImage} />
            <div
              className="smallPictureDescription"
              dangerouslySetInnerHTML={{__html: rightImageDesc}}
            ></div>
            <div className="smallInfo">
              <div className="smallInfoTitleRight">Information</div>
              <div className="smallInfoMain">
                {right.claims &&
                  Object.keys(right.claims)
                    .slice(0, 5)
                    .map(c => (
                      <div className="theSmalls" key={c}>
                        <div className="smallInfoH">
                          {this.props.getLabel(c)}
                        </div>
                        <div className="smallInfoD">
                          {right.claims[c]
                            .map(v => this.props.getLabel(v.value))
                            .join(', ')}
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          </div>
        </div>
        <Comments q1={left.id} q2={right.id} />
      </div>
    );
  }
}

const mapState = state => {
  return {
    profile: state.profile,
    user: state.user
  };
};

export default connect(mapState)(CompareDisplay);
