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
import {CompareDisplay} from './index.js';
import {getComments} from '../store';

/**
 * COMPONENT
 */
export class Compare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        qname1: '',
        qname2: ''
      },

      leftSearch: [],
      rightSearch: [],
      leftQSearch: '',
      rightQSearch: '',

      left: {},
      right: {},
      results: {},
      l2results: {},
      names: {},
      complexNames: {},
      leftImage: '/img/leftUnicorn.png',
      leftImageDesc: '',
      rightImage: '/img/rightUnicorn.png',
      rightImageDesc: ''
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

  compareTwo(entities, q1, q2) {
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

  async onSubmit(evt) {
    evt.preventDefault();
    this.setState({
      leftSearch: [],
      rightSearch: []
    });

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

    this.props.getComments(this.state.leftQSearch, this.state.rightQSearch);
  }

  render() {
    return (
      <div onClick={() => this.setState({leftSearch: [], rightSearch: []})}>
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
        <CompareDisplay
          qname1={this.state.form.qName1}
          qname2={this.state.form.qName2}
          left={this.state.left}
          right={this.state.right}
          leftQSearch={this.state.leftQSearch}
          rightQSearch={this.state.rightQSearch}
          leftImage={this.state.leftImage}
          rightImage={this.state.rightImage}
          leftImageDesc={this.state.leftImageDesc}
          results={this.state.results}
          l2results={this.state.l2results}
          getLabel={this.getLabel}
          names={this.state.names /* needed to enforce update */}
          complexNames={this.state.complexNames}
        />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getProfileById: () => dispatch(getProfileByIdThunk()),
    getComments: (q1, q2) => dispatch(getComments(q1, q2))
  };
};

const mapState = state => {
  return {
    profile: state.profile,
    user: state.user
  };
};

export default connect(mapState, mapDispatchToProps)(Compare);
