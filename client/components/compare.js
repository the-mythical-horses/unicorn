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
      results: {},
      l2results: {},
      names: {},
      complexNames: {},
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

  async compareTwo(entities, q1, q2) {
    console.log(q1, q2);
    const q1Different = {};
    const same = {};
    const ids = new Set();
    const q1claims = Object.keys(entities[q1].claims);
    q1claims.forEach(c => {
      if (entities[q2].claims[c]) {
        entities[q1].claims[c].forEach(v => {
          const entitiesq2claimscvalues = entities[q2].claims[c].map(
            v => v.value
          );
          if (entitiesq2claimscvalues.includes(v.value)) {
            ids.add(v.value);
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
    if (ids.size > 0) {
      const namesResp = await axios.get(
        wdk.getEntities({
          ids: Array.from(ids),
          languages: ['en'],
          props: ['labels']
        })
      );
      const namesEntities = namesResp.data.entities;
      const names = wdk.simplify.entities(namesEntities);
      this.setState({
        names: {...this.state.names, ...names},
        complexNames: {...this.state.complexNames, ...namesEntities}
      });
    }
    return same;
  }

  async onSubmit(evt) {
    evt.preventDefault();
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
        props: ['info', 'claims']
      })
    );
    const entities = wdk.simplify.entities(entitiesResp.data.entities, {
      keepTypes: true
    });

    const results = await this.compareTwo(entities, q1, q2);

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
      }
    }
    for (let property in q2Different) {
      if (!q1Different[property]) {
        delete q2Different[property];
      }
    }

    console.log('q1d', q1Different, 'q2d', q2Different);
    const fetchList = [
      ...Object.values(q1Different).flat(),
      ...Object.values(q2Different).flat()
    ];
    const l2entitiesResp = await axios.get(
      wdk.getEntities({
        ids: fetchList,
        languages: ['en'],
        props: ['info', 'claims']
      })
    );
    const level2entities = wdk.simplify.entities(l2entitiesResp.data.entities, {
      keepTypes: true
    });
    for (let property in q1Different) {
      const results = await this.compareTwo(
        level2entities,
        q1Different[property][0],
        q2Different[property][0]
      );
      this.setState({
        l2results: {...this.state.l2results, [property]: results}
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
        <p>Compare:</p>
        <form onSubmit={this.onSubmit}>
          <div className="input-field col s6">
            <label htmlFor="qname1">Object 1</label>
            <input
              type="text"
              name="qname1"
              onChange={this.onChange}
              value={this.state.form.qname1}
            />
          </div>
          <div className="input-field col s6">
            <label htmlFor="qname2">Object 2</label>
            <input
              type="text"
              name="qname2"
              onChange={this.onChange}
              value={this.state.form.qname2}
            />
          </div>
          <button type="submit" className="waves-effect waves-light btn">
            Submit
          </button>
        </form>
        <ol>
          {Object.keys(this.state.results).map(p => (
            <li key={p}>
              {`${this.getLabel(p)}: ${this.state.results[p]
                .map(q => this.getLabel(q))
                .join(', ')}`}
            </li>
          ))}
        </ol>
        <ol>
          {Object.keys(this.state.l2results).map(p => (
            <li key={p}>
              <ol>
                {`${this.getLabel(p)}: `}
                {Object.keys(this.state.l2results[p]).map(p2 => (
                  <li key={p2}>
                    {`${this.getLabel(p2)}: ${this.state.l2results[p][p2]
                      .map(q => this.getLabel(q))
                      .join(', ')}`}
                  </li>
                ))}
              </ol>
            </li>
          ))}
        </ol>
      </div>
    );
  }
}
export default Compare;
