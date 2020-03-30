/* eslint-disable complexity */
import React from 'react';
import wdk from 'wikidata-sdk';
import {connect} from 'react-redux';

class CompareDisplay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      levelOneInfo: false,
      levelTwoInfo: false
    };
  }

  render() {
    return (
      <div id="elisCards">
        <div className="elisCard smallCards" id="leftCard">
          <div className="smallTitleLeft">
            {this.props.left.labels ? this.props.left.labels.en : ''}
          </div>
          <div className="smallSubTitle">
            {this.props.left.descriptions
              ? this.props.left.descriptions.en
              : ''}
          </div>
          <img className="compare-img" src={this.props.leftImage} />
          <div
            className="smallPictureDescription"
            dangerouslySetInnerHTML={{__html: this.props.leftImageDesc}}
          ></div>
          <div className="smallInfo">
            <div className="smallInfoTitleLeft">Information</div>
            <div className="smallInfoMain">
              {this.props.left.claims &&
                Object.keys(this.props.left.claims)
                  .slice(0, 5)
                  .map(c => (
                    <div className="theSmalls" key={c}>
                      <div className="smallInfoH">{this.props.getLabel(c)}</div>
                      <div className="smallInfoD">
                        {this.props.left.claims[c]
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
                here goes a message explaining the definition oflevel 1 results
              </div>
            ) : (
              <div></div>
            )}
          </div>
          <ol>
            {Object.keys(this.props.results).map(p => (
              <li key={p}>
                <span className="twoProp">{`${this.props.getLabel(p)}: `}</span>
                {`${this.props.results[p]
                  .map(q => this.props.getLabel(q))
                  .join(', ')}`}
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
                here goes a message explaining the definition of level 2 results
              </div>
            ) : (
              <div></div>
            )}
          </div>
          <ol>
            {Object.keys(this.props.l2results).map(p => (
              <li key={p}>
                <span className="twoProp">
                  <span>
                    {`${this.props.getLabel(this.props.l2results[p].key[0])} (`}
                  </span>
                  <span className="leftLabel">
                    {`${this.props.getLabel(this.props.l2results[p].key[1])}`}
                  </span>
                  {`, `}
                  <span className="rightLabel">
                    {`${this.props.getLabel(this.props.l2results[p].key[2])}`}
                  </span>
                  {`): `}
                </span>
                <ol>
                  {Object.keys(this.props.l2results[p].results).map(p2 => (
                    <li key={p2}>
                      {`${this.props.getLabel(p2)}: ${this.props.l2results[
                        p
                      ].results[p2]
                        .map(q => this.props.getLabel(q))
                        .join(', ')}`}
                    </li>
                  ))}
                </ol>
              </li>
            ))}
          </ol>
        </div>
        <div className="elisCard smallCards" id="rightCard">
          <div className="smallTitleRight">
            {this.props.right.labels ? this.props.right.labels.en : ''}
          </div>
          <div className="smallSubTitle">
            {this.props.right.descriptions
              ? this.props.right.descriptions.en
              : ''}
          </div>
          <img className="compare-img" src={this.props.rightImage} />
          <div
            className="smallPictureDescription"
            dangerouslySetInnerHTML={{__html: this.props.rightImageDesc}}
          ></div>
          <div className="smallInfo">
            <div className="smallInfoTitleRight">Information</div>
            <div className="smallInfoMain">
              {this.props.right.claims &&
                Object.keys(this.props.right.claims)
                  .slice(0, 5)
                  .map(c => (
                    <div className="theSmalls" key={c}>
                      <div className="smallInfoH">{this.props.getLabel(c)}</div>
                      <div className="smallInfoD">
                        {this.props.right.claims[c]
                          .map(v => this.props.getLabel(v.value))
                          .join(', ')}
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(null, null)(CompareDisplay);
