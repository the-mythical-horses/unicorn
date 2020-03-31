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
      left: {},
      right: {},
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
      levelTwoInfo: false
    };

    this.compareTwo = this.compareTwo.bind(this);
    this.getLabel = this.getLabel.bind(this);
  }
  componentDidMount() {
    this.componentDidUpdate();
  }

  async componentDidUpdate() {
    let left = {};
    let right = {};
    let names = {};
    let complexNames = {};
    let results = {};
    let l2results = {};

    let leftQSearch = this.props.submitted.leftQSearch;
    let rightQSearch = this.props.submitted.rightQSearch;
    let qname1 = this.props.submitted.qname1;
    let qname2 = this.props.submitted.qname2;

    const ids = new Set();
    let q1;
    if (leftQSearch !== 'PROFILE') {
      const q1name2obj = await axios.get(
        wdk.searchEntities(leftQSearch ? leftQSearch : qname1)
      );
      q1 = q1name2obj.data.search[0].id;
    } else {
      q1 = 'PROFILE';
    }
    const q2name2obj = await axios.get(
      wdk.searchEntities(rightQSearch ? rightQSearch : qname2)
    );
    const q2 = q2name2obj.data.search[0].id;
    let entities;
    let entitiesResp;
    if (leftQSearch !== 'PROFILE') {
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
    left = entities[q1];
    right = entities[q2];

    let [leftImage, leftImageDesc] = await this.getImage(entities, q1);
    if (!leftImage) {
      leftImage = '/img/leftUnicorn.png';
      leftImageDesc = '';
    }
    let [rightImage, rightImageDesc] = await this.getImage(entities, q2);
    if (!rightImage) {
      rightImage = '/img/rightUnicorn.png';
      rightImageDesc = '';
    }
    let [l1results, l1ids] = this.compareTwo(entities, q1, q2);
    results = l1results;
    l1ids.forEach(id => ids.add(id));

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
          const [l2SubResults, l2ids] = this.compareTwo(level2entities, v1, v2);
          l2ids.forEach(id => ids.add(id));
          const keyName = [property, v1, v2];
          if (Object.keys(l2SubResults.length > 0)) {
            ids.add(v1);
            ids.add(v2);
            l2results[keyName] = {
              key: keyName,
              results: l2SubResults
            };
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
        const newNames = wdk.simplify.entities(namesEntities);
        names = {...names, ...newNames};
        complexNames = {...complexNames, ...namesEntities};
      }
    }

    this.setState({
      left,
      right,
      names,
      complexNames,
      l2results,
      leftImage,
      leftImageDesc,
      rightImage,
      rightImageDesc,
      results
    });
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

  getLabel(id, names, complexNames = null) {
    if (names[id] && names[id].labels && names[id].labels.en) {
      return names[id].labels.en;
    }
    if (
      complexNames[id] &&
      complexNames[id].lemmas &&
      complexNames[id].lemmas.en &&
      complexNames[id].lemmas.en.value
    ) {
      return complexNames[id].lemmas.en.value;
    }
    return id;
  }

  render() {
    let results = this.state.results;
    let l2results = this.state.l2results;

    let left = this.state.left;
    let right = this.state.right;
    let names = this.state.names;
    let complexNames = this.state.complexNames;
    let leftImage = this.state.leftImage;
    let leftImageDesc = this.state.leftImageDesc;
    let rightImage = this.state.rightImage;
    let rightImageDesc = this.state.rightImageDesc;

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
                          {this.getLabel(c, names, complexNames)}
                        </div>
                        <div className="smallInfoD">
                          {left.claims[c]
                            .map(v =>
                              this.getLabel(v.value, names, complexNames)
                            )
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
              {Object.keys(results).map(p => (
                <li key={p}>
                  <span className="twoProp">{`${this.getLabel(
                    p,
                    names,
                    complexNames
                  )}: `}</span>
                  {`${results[p]
                    .map(q => this.getLabel(q, names, complexNames))
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
              {Object.keys(l2results).map(p => (
                <li key={p}>
                  <span className="twoProp">
                    <span>
                      {`${this.getLabel(
                        l2results[p].key[0],
                        names,
                        complexNames
                      )} (`}
                    </span>
                    <span className="leftLabel">
                      {`${this.getLabel(
                        l2results[p].key[1],
                        names,
                        complexNames
                      )}`}
                    </span>
                    {`, `}
                    <span className="rightLabel">
                      {`${this.getLabel(
                        l2results[p].key[2],
                        names,
                        complexNames
                      )}`}
                    </span>
                    {`): `}
                  </span>
                  <ol>
                    {Object.keys(l2results[p].results).map(p2 => (
                      <li key={p2}>
                        {`${this.getLabel(
                          p2,
                          names,
                          complexNames
                        )}: ${l2results[p].results[p2]
                          .map(q => this.getLabel(q, names, complexNames))
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
                          {this.getLabel(c, names, complexNames)}
                        </div>
                        <div className="smallInfoD">
                          {right.claims[c]
                            .map(v =>
                              this.getLabel(v.value, names, complexNames)
                            )
                            .join(', ')}
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          </div>
        </div>
        <Comments q1={this.state.left.id} q2={this.state.right.id} />
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

export default connect(mapState, null)(CompareDisplay);
