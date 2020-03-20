import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import wdk from 'wikidata-sdk';
import sparqljs from 'sparqljs';
import axios from 'axios';
import {Link} from 'react-router-dom';

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

    const entitiesResp = await axios.get(
      wdk.getEntities({
        ids: [q1, q2],
        languages: ['en'],
        props: ['info', 'claims']
      })
    );
    const entities = wdk.simplify.entities(entitiesResp.data.entities);
    const q1claims = Object.keys(entities[q1].claims);
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

    if (ids.length > 0) {
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
    } else {
      this.setState({
        results: same
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
          <label htmlFor="qname1">Object 1:</label>
          <input
            type="text"
            name="qname1"
            onChange={this.onChange}
            value={this.state.form.qname1}
          />
          <label htmlFor="qname2">Object 2:</label>
          <input
            type="text"
            name="qname2"
            onChange={this.onChange}
            value={this.state.form.qname2}
          />
          <button type="submit">Submit</button>
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
