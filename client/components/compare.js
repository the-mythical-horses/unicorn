/* eslint-disable max-statements */
/* eslint-disable guard-for-in */
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
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
      right: {},
      results: {},
      l2results: {},
      names: {},
      complexNames: {},
      leftImage: '/img/leftUnicorn.png',
      leftImageDesc: '',
      rightImage: '/img/rightUnicorn.png',
      rightImageDesc: '',
      form: {
        qname1: '',
        qname2: ''
      }
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.getLabel = this.getLabel.bind(this);
    this.compareTwo = this.compareTwo.bind(this);
  }

  componentDidMount() {
    M.AutoInit();
  }

  onChange(evt) {
    this.setState({
      form: {
        ...this.state.form,
        [evt.target.name]: evt.target.value
      }
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
    if (!entities[q].claims.P18) {
      return '';
    }
    const wikiResp = await axios.get(
      'https://commons.wikimedia.org/w/api.php',
      {
        params: {
          action: 'query',
          titles: `File:${entities[q].claims.P18[0].value}`, // TODO get multiple imgs in one request by separating with pipe character?
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
      l2results: {}
    });
    const ids = new Set();
    const q1name2obj = await axios.get(
      wdk.searchEntities(this.state.form.qname1)
    );
    const q1 = q1name2obj.data.search[0].id;
    const q2name2obj = await axios.get(
      wdk.searchEntities(this.state.form.qname2)
    );
    const q2 = q2name2obj.data.search[0].id;

    const entitiesResp = await axios.get(
      wdk.getEntities({
        ids: [q1, q2],
        languages: ['en'],
        props: ['info', 'claims', 'labels', 'descriptions']
      })
    );
    const entities = wdk.simplify.entities(entitiesResp.data.entities, {
      keepTypes: true,
      addUrl: true
    });
    this.setState({
      left: entities[q1],
      right: entities[q2]
    });
    console.log(entities);

    const [leftImage, leftImageDesc] = await this.getImage(entities, q1);
    if (leftImage) {
      this.setState({leftImage, leftImageDesc});
    }
    const [rightImage, rightImageDesc] = await this.getImage(entities, q2);
    if (rightImage) {
      this.setState({rightImage, rightImageDesc});
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
      urls.forEach(async url => {
        const namesResp = await axios.get(url);
        const namesEntities = namesResp.data.entities;
        const names = wdk.simplify.entities(namesEntities);
        this.setState({
          names: {...this.state.names, ...names},
          complexNames: {...this.state.complexNames, ...namesEntities}
        });
      });
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
    return (
      <div>
        <form id="compareForm" onSubmit={this.onSubmit}>
          <div className="input-field col s6">
            <label htmlFor="qname1">Object 1</label>
            <input
              type="text"
              name="qname1"
              onChange={this.onChange}
              value={this.state.form.qname1}
            />
          </div>
          <button type="submit" className="btn" id="compare-btn">
            Compare
          </button>
          <div className="input-field col s6">
            <label htmlFor="qname2">Object 2</label>
            <input
              type="text"
              name="qname2"
              onChange={this.onChange}
              value={this.state.form.qname2}
            />
          </div>
        </form>

        <div id="elisCards">
          <div className="elisCard smallCards">
            <div className="smallTitle">
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
              <div className="smallInfoTitle">Information</div>
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
            <div className="levelHeader">Level 1</div>
            <ol>
              {Object.keys(this.state.results).map(p => (
                <li key={p}>
                  {`${this.getLabel(p)}: ${this.state.results[p]
                    .map(q => this.getLabel(q))
                    .join(', ')}`}
                </li>
              ))}
            </ol>
            <div className="levelHeader">Level 2</div>
            <ol>
              {Object.keys(this.state.l2results).map(p => (
                <li key={p}>
                  {`${this.getLabel(
                    this.state.l2results[p].key[0]
                  )} (${this.getLabel(
                    this.state.l2results[p].key[1]
                  )}, ${this.getLabel(this.state.l2results[p].key[2])}): `}
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
            <div className="levelHeader">Level 3</div>
          </div>
          <div className="elisCard smallCards">
            <div className="smallTitle">
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
              <div className="smallInfoTitle">Information</div>
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
export default Compare;
