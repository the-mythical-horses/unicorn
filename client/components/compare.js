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

    const entities = this.compareTwo(q1, q2);

    const q1claims = Object.keys(entities[q1].claims);
    const q2claims = Object.keys(entities[q2].claims);
    const q1Different = {};
    const q2Different = {};

    q1claims.forEach(c => {
      if (entities[q2].claims[c]) {
        entities[q1].claims[c].forEach(v => {
          if (entities[q2].claims[c].includes(v)) {
            console.log('something');
          } else {
            // eslint-disable-next-line no-lonely-if
            if (q1Different[c]) {
              q1Different[c].push(v);
            } else {
              q1Different[c] = [v];
            }
          }
        });
      }
    });

    q2claims.forEach(c => {
      if (entities[q1].claims[c]) {
        entities[q2].claims[c].forEach(v => {
          if (entities[q1].claims[c].includes(v)) {
            console.log('something');
          } else {
            // eslint-disable-next-line no-lonely-if
            if (q2Different[c]) {
              q2Different[c].push(v);
            } else {
              q2Different[c] = [v];
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

    // const q1DifferentLoop = async () => {
    //   for (let property in q1Different) {
    //     await axios.get(
    //       wdk.getEntities({
    //       ids: [q1, q2],
    //       languages: ['en'],
    //       props: ['info', 'claims']
    //      })
    //   );
    // };

    const namesResp = await axios.get(
      wdk.getEntities({
        ids: Array.from(ids),
        languages: ['en'],
        props: ['labels']
      })
    );
    const names = wdk.simplify.entities(namesResp.data.entities);
    this.setState({
      results: same,
      names,
      complexNames: namesResp.data.entities
    });
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

  async compareTwo(q1, q2) {
    const entitiesResp = await axios.get(
      wdk.getEntities({
        ids: [q1, q2],
        languages: ['en'],
        props: ['info', 'claims']
      })
    );
    const entities = wdk.simplify.entities(entitiesResp.data.entities);
    const q1Different = {};
    console.log(q1claims);
    const same = {};
    const ids = new Set();
    q1claims.forEach(c => {
      if (entities[q2].claims[c]) {
        entities[q1].claims[c].forEach(v => {
          if (entities[q2].claims[c].includes(v)) {
            ids.add(v);
            ids.add(c);
            if (same[c]) {
              same[c].push(v);
            } else {
              same[c] = [v];
            }
          }
        });
      }
    });
    return entities;
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
      </div>
    );
  }
}
export default Compare;
