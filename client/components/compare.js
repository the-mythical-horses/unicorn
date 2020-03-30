/* eslint-disable complexity */
/* eslint-disable max-statements */
/* eslint-disable guard-for-in */
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {
  setProfileByIdThunk,
  getProfileById,
  getProfileByIdThunk
} from '../store/profiles';
import wdk from 'wikidata-sdk';
import sparqljs from 'sparqljs';
import axios from 'axios';
import {Link} from 'react-router-dom';
import M from 'materialize-css';

/**
 * COMPONENT
 */
export class Compare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      left: {},
      leftSearch: [],
      leftQSearch: '',
      right: {},
      rightSearch: [],
      rightQSearch: '',
      results: {},
      l2results: {},
      names: {},
      complexNames: {},
      leftImage: '/img/smoke-uni-left-chain.png',
      leftImageDesc: '',
      rightImage: '/img/smoke-uni.png',
      rightImageDesc: '',
      form: {
        qname1: '',
        qname2: ''
      },
      levelOneInfo: false,
      levlTwoInfo: false
    };
    this.onChangeLeft = this.onChangeLeft.bind(this);
    this.onChangeRight = this.onChangeRight.bind(this);

    this.onSubmit = this.onSubmit.bind(this);
    this.getLabel = this.getLabel.bind(this);
    this.compareTwo = this.compareTwo.bind(this);
  }

  async componentDidMount() {
    M.AutoInit();

    await this.props.getProfileById();
  }

  async onChangeLeft(evt) {
    await this.setState({
      form: {
        ...this.state.form,
        [evt.target.name]: evt.target.value
      },
      leftQSearch: ''
    });
    if (this.state.form.qname1.length > 0) {
      const q1Search = await axios.get(
        wdk.searchEntities(this.state.form.qname1)
      );
      if (q1Search.data.search) {
        this.setState({
          leftSearch: q1Search.data.search.slice(0, 6)
        });
      }
    }
  }

  async onChangeRight(evt) {
    await this.setState({
      form: {
        ...this.state.form,
        [evt.target.name]: evt.target.value
      },
      rightQSearch: ''
    });
    if (this.state.form.qname2.length > 0) {
      const q2Search = await axios.get(
        wdk.searchEntities(this.state.form.qname2)
      );
      if (q2Search.data.search) {
        this.setState({
          rightSearch: q2Search.data.search.slice(0, 6)
        });
      }
    }
  }

  compareTwo(entities, q1, q2) {
    console.log('entities!!!', entities);
    const same = {};
    const ids = new Set();
    const q1claims = Object.keys(entities[q1].claims);
    q1claims.forEach(c => {
      if (entities[q2].claims[c]) {
        entities[q1].claims[c].forEach(v => {
          const entitiesQ2ClaimsCValues = entities[q2].claims[c].map(
            v => v.value
          );
          if (entitiesQ2ClaimsCValues.includes(v.value)) {
            if (v.type === 'wikibase-item') {
              ids.add(v.value);
            }
            ids.add(c);
            if (same[c]) {
              same[c].push(v.value);
            } else {
              same[c] = [v.value];
            }
          }
        });
      }
    });
    return [same, Array.from(ids)];
  }

  async getImage(entities, q) {
    if (q === 'PROFILE') {
      if (this.props.user.avatar) {
        return [this.props.user.avatar, ''];
      }
    }
    let picClaim = null;
    if (entities[q].claims.P18) {
      picClaim = entities[q].claims.P18;
    } else if (entities[q].claims.P154) {
      picClaim = entities[q].claims.P154;
    } else if (entities[q].claims.P158) {
      picClaim = entities[q].claims.P158;
    } else if (entities[q].claims.P109) {
      picClaim = entities[q].claims.P109;
    }
    if (!picClaim) {
      return '';
    }
    const wikiResp = await axios.get(
      'https://commons.wikimedia.org/w/api.php',
      {
        params: {
          action: 'query',
          titles: `File:${picClaim[0].value}`, // TODO get multiple imgs in one request by separating with pipe character?
          prop: 'imageinfo',
          iiprop: 'url|extmetadata',
          origin: '*',
          format: 'json'
        }
      }
    );
    for (let page in wikiResp.data.query.pages) {
      if (wikiResp.data.query.pages[page].imageinfo) {
        if (
          wikiResp.data.query.pages[page].imageinfo[0].extmetadata
            .ImageDescription
        ) {
          return [
            wikiResp.data.query.pages[page].imageinfo[0].url,
            wikiResp.data.query.pages[page].imageinfo[0].extmetadata
              .ImageDescription.value
          ];
        }
        return [wikiResp.data.query.pages[page].imageinfo[0].url, ''];
      }
    }
    return '';
  }

  async onSubmit(evt) {
    evt.preventDefault();
    this.setState({
      results: {},
      l2results: {},
      leftSearch: [],
      rightSearch: []
    });
    const ids = new Set();
    let q1;
    if (this.state.leftQSearch !== 'PROFILE') {
      const q1name2obj = await axios.get(
        wdk.searchEntities(
          this.state.leftQSearch
            ? this.state.leftQSearch
            : this.state.form.qname1
        )
      );
      q1 = q1name2obj.data.search[0].id;
    } else {
      q1 = 'PROFILE';
    }
    const q2name2obj = await axios.get(
      wdk.searchEntities(
        this.state.rightQSearch
          ? this.state.rightQSearch
          : this.state.form.qname2
      )
    );
    const q2 = q2name2obj.data.search[0].id;
    let entities;
    let entitiesResp;
    if (this.state.leftQSearch !== 'PROFILE') {
      entitiesResp = await axios.get(
        wdk.getEntities({
          ids: [q1, q2],
          languages: ['en'],
          props: ['info', 'claims', 'labels', 'descriptions']
        })
      );
      entities = wdk.simplify.entities(entitiesResp.data.entities, {
        keepTypes: true,
        addUrl: true
      });
    } else {
      entitiesResp = await axios.get(
        wdk.getEntities({
          ids: [q2],
          languages: ['en'],
          props: ['info', 'claims', 'labels', 'descriptions']
        })
      );
      entities = wdk.simplify.entities(entitiesResp.data.entities, {
        keepTypes: true,
        addUrl: true
      });
      entities.PROFILE = this.props.profile.PROFILE;
    }
    this.setState({
      left: entities[q1],
      right: entities[q2]
    });

    const [leftImage, leftImageDesc] = await this.getImage(entities, q1);
    if (leftImage) {
      this.setState({leftImage, leftImageDesc});
    } else {
      this.setState({
        leftImage: '/img/leftUnicorn.png',
        leftImageDesc: ''
      });
    }
    const [rightImage, rightImageDesc] = await this.getImage(entities, q2);
    if (rightImage) {
      this.setState({rightImage, rightImageDesc});
    } else {
      this.setState({
        rightImage: '/img/rightUnicorn.png',
        rightImageDesc: ''
      });
    }
    const [results, l1ids] = this.compareTwo(entities, q1, q2);
    l1ids.forEach(id => ids.add(id));

    this.setState({results});

    const q1claims = Object.keys(entities[q1].claims);
    const q2claims = Object.keys(entities[q2].claims);
    const q1Different = {};
    const q2Different = {};

    q1claims.forEach(c => {
      if (entities[q2].claims[c]) {
        entities[q1].claims[c].forEach(v => {
          const entitiesq2claimscvalues = entities[q2].claims[c].map(
            v => v.value
          );
          if (
            !entitiesq2claimscvalues.includes(v.value) &&
            v.type === 'wikibase-item'
          ) {
            if (q1Different[c]) {
              q1Different[c].push(v.value);
            } else {
              q1Different[c] = [v.value];
            }
          }
        });
      }
    });
    q2claims.forEach(c => {
      if (entities[q1].claims[c]) {
        entities[q2].claims[c].forEach(v => {
          const entitiesq1claimscvalues = entities[q1].claims[c].map(
            v => v.value
          );
          if (
            !entitiesq1claimscvalues.includes(v.value) &&
            v.type === 'wikibase-item'
          ) {
            if (q2Different[c]) {
              q2Different[c].push(v.value);
            } else {
              q2Different[c] = [v.value];
            }
          }
        });
      }
    });

    for (let property in q1Different) {
      if (!q2Different[property]) {
        delete q1Different[property];
        delete q2Different[property];
      }
    }
    for (let property in q2Different) {
      if (!q1Different[property]) {
        delete q1Different[property];
        delete q2Different[property];
      }
    }

    const fetchList = [
      ...Object.values(q1Different).flat(),
      ...Object.values(q2Different).flat()
    ];
    const l2entitiesUrls = wdk.getManyEntities({
      ids: fetchList,
      languages: ['en'],
      props: ['info', 'claims']
    });
    let level2entities = {};
    for (let i = 0; i < l2entitiesUrls.length; i++) {
      const l2entitiesResp = await axios.get(l2entitiesUrls[i]);
      const l2entitiesSimplified = wdk.simplify.entities(
        l2entitiesResp.data.entities,
        {
          keepTypes: true
        }
      );
      level2entities = {...level2entities, ...l2entitiesSimplified};
    }
    for (let property in q1Different) {
      q1Different[property].forEach(v1 => {
        q2Different[property].forEach(v2 => {
          if (v1 === v2) {
            return;
          }
          const [results, l2ids] = this.compareTwo(level2entities, v1, v2);
          l2ids.forEach(id => ids.add(id));
          const keyName = [property, v1, v2];
          if (Object.keys(results).length > 0) {
            ids.add(v1);
            ids.add(v2);
            this.setState({
              l2results: {
                ...this.state.l2results,
                [keyName]: {key: keyName, results}
              }
            });
          }
        });
      });
    }
    Object.keys(q1Different).forEach(id => ids.add(id));
    [q1, q2].forEach(q => {
      Object.keys(entities[q].claims)
        .slice(0, 5)
        .forEach(pid => {
          entities[q].claims[pid].forEach(v => {
            if (v.type === 'wikibase-item') {
              ids.add(v.value);
            }
          });
          ids.add(pid);
        });
    });
    if (ids.size > 0) {
      const urls = wdk.getManyEntities({
        ids: Array.from(ids),
        languages: ['en'],
        props: ['labels']
      });
      for (let i = 0; i < urls.length; i++) {
        const namesResp = await axios.get(urls[i]);
        const namesEntities = namesResp.data.entities;
        const names = wdk.simplify.entities(namesEntities);
        this.setState({
          names: {...this.state.names, ...names},
          complexNames: {...this.state.complexNames, ...namesEntities}
        });
      }
    }
  }

  getLabel(id) {
    if (
      this.state.names[id] &&
      this.state.names[id].labels &&
      this.state.names[id].labels.en
    ) {
      return this.state.names[id].labels.en;
    }
    if (
      this.state.complexNames[id] &&
      this.state.complexNames[id].lemmas &&
      this.state.complexNames[id].lemmas.en &&
      this.state.complexNames[id].lemmas.en.value
    ) {
      return this.state.complexNames[id].lemmas.en.value;
    }
    return id;
  }

  render() {
    const {email} = this.props;
    let levelOneInfo = false;
    let levelTwoInfo = false;
    return (
      <div>
        <button
          type="button"
          id="insert-btn"
          onClick={() =>
            this.setState({
              leftQSearch: 'PROFILE',
              form: {
                ...this.state.form,
                qname1: 'My Profile'
              }
            })
          }
        >
          Insert Profile as Object 1
        </button>
        <form id="compareForm" onSubmit={this.onSubmit}>
          <div className="in-drop">
            <div className="col s6">
              <label htmlFor="qname1">Object 1</label>
              <input
                id="input1"
                type="text"
                name="qname1"
                onChange={this.onChangeLeft}
                value={this.state.form.qname1}
                autoComplete="off"
              />
              {this.state.form.qname1 === 'My Profile' ? (
                <div id="my-profile">My Profile</div>
              ) : (
                <div className="empty-div"></div>
              )}
            </div>

            <div className="drop-container1">
              <ul className="drop-list">
                {this.state.leftSearch.map(s => (
                  <li
                    className="drop-item"
                    onClick={() =>
                      this.setState({
                        leftSearch: [],
                        leftQSearch: s.id,
                        form: {
                          ...this.state.form,
                          qname1: s.label
                        }
                      })
                    }
                    key={s.id}
                  >
                    <div className="drop-label">{s.label}</div>
                    <div className="drop-description">{s.description}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button type="submit" className="btn" id="compare-btn">
            Compare
          </button>

          <div className="in-drop">
            <div className="col s6">
              <label htmlFor="qname2">Object 2</label>
              <input
                id="input2"
                type="text"
                name="qname2"
                onChange={this.onChangeRight}
                value={this.state.form.qname2}
                autoComplete="off"
              />
              <div className="drop-container2">
                <ul className="drop-list">
                  {this.state.rightSearch.map(s => (
                    <li
                      className="drop-item"
                      onClick={() =>
                        this.setState({
                          rightSearch: [],
                          rightQSearch: s.id,
                          form: {
                            ...this.state.form,
                            qname2: s.label
                          }
                        })
                      }
                      key={s.id}
                    >
                      <div className="drop-label">{s.label}</div>
                      <div className="drop-description">{s.description} </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </form>

        <div id="elisCards">
          <div className="elisCard smallCards" id="leftCard">
            <div className="smallTitleLeft">
              {this.state.left.labels ? this.state.left.labels.en : ''}
            </div>
            <div className="smallSubTitle">
              {this.state.left.descriptions
                ? this.state.left.descriptions.en
                : ''}
            </div>
            <img className="compare-img" src={this.state.leftImage} />
            <div
              className="smallPictureDescription"
              dangerouslySetInnerHTML={{__html: this.state.leftImageDesc}}
            ></div>
            <div className="smallInfo">
              <div className="smallInfoTitleLeft">Information</div>
              <div className="smallInfoMain">
                {this.state.left.claims &&
                  Object.keys(this.state.left.claims)
                    .slice(0, 5)
                    .map(c => (
                      <div className="theSmalls" key={c}>
                        <div className="smallInfoH">{this.getLabel(c)}</div>
                        <div className="smallInfoD">
                          {this.state.left.claims[c]
                            .map(v => this.getLabel(v.value))
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
                  here goes a message explaining the definition oflevel 1
                  results
                </div>
              ) : (
                <div></div>
              )}
            </div>
            <ol>
              {Object.keys(this.state.results).map(p => (
                <li key={p}>
                  <span className="twoProp">{`${this.getLabel(p)}: `}</span>
                  {`${this.state.results[p]
                    .map(q => this.getLabel(q))
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
                  here goes a message explaining the definition of level 2
                  results
                </div>
              ) : (
                <div></div>
              )}
            </div>
            <ol>
              {Object.keys(this.state.l2results).map(p => (
                <li key={p}>
                  <span className="twoProp">
                    <span>
                      {`${this.getLabel(this.state.l2results[p].key[0])} (`}
                    </span>
                    <span className="leftLabel">
                      {`${this.getLabel(this.state.l2results[p].key[1])}`}
                    </span>
                    {`, `}
                    <span className="rightLabel">
                      {`${this.getLabel(this.state.l2results[p].key[2])}`}
                    </span>
                    {`): `}
                  </span>
                  <ol>
                    {Object.keys(this.state.l2results[p].results).map(p2 => (
                      <li key={p2}>
                        {`${this.getLabel(p2)}: ${this.state.l2results[
                          p
                        ].results[p2]
                          .map(q => this.getLabel(q))
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
              {this.state.right.labels ? this.state.right.labels.en : ''}
            </div>
            <div className="smallSubTitle">
              {this.state.right.descriptions
                ? this.state.right.descriptions.en
                : ''}
            </div>
            <img className="compare-img" src={this.state.rightImage} />
            <div
              className="smallPictureDescription"
              dangerouslySetInnerHTML={{__html: this.state.rightImageDesc}}
            ></div>
            <div className="smallInfo">
              <div className="smallInfoTitleRight">Information</div>
              <div className="smallInfoMain">
                {this.state.right.claims &&
                  Object.keys(this.state.right.claims)
                    .slice(0, 5)
                    .map(c => (
                      <div className="theSmalls" key={c}>
                        <div className="smallInfoH">{this.getLabel(c)}</div>
                        <div className="smallInfoD">
                          {this.state.right.claims[c]
                            .map(v => this.getLabel(v.value))
                            .join(', ')}
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getProfileById: () => dispatch(getProfileByIdThunk())
  };
};

const mapState = state => {
  return {
    profile: state.profile,
    user: state.user
  };
};

export default connect(mapState, mapDispatchToProps)(Compare);
