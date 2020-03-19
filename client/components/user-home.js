import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import wdk from 'wikidata-sdk';
import sparqljs from 'sparqljs';
import axios from 'axios';

/**
 * COMPONENT
 */
export class UserHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {result: []};
  }

  async componentDidMount() {
    const sparqlObj = {
      queryType: 'SELECT',
      variables: [
        {termType: 'Variable', value: 'item'},
        {termType: 'Variable', value: 'itemLabel'}
      ],
      where: [
        {
          type: 'bgp',
          triples: [
            {
              subject: {termType: 'Variable', value: 'item'},
              predicate: {
                termType: 'NamedNode',
                value: 'http://www.wikidata.org/prop/direct/P1050'
              },
              object: {
                termType: 'NamedNode',
                value: 'http://www.wikidata.org/entity/Q84263196'
              }
            }
          ]
        },
        {
          type: 'service',
          patterns: [
            {
              type: 'bgp',
              triples: [
                {
                  subject: {
                    termType: 'NamedNode',
                    value: 'http://www.bigdata.com/rdf#serviceParam'
                  },
                  predicate: {
                    termType: 'NamedNode',
                    value: 'http://wikiba.se/ontology#language'
                  },
                  object: {
                    termType: 'Literal',
                    value: '[AUTO_LANGUAGE],en',
                    language: '',
                    datatype: {
                      termType: 'NamedNode',
                      value: 'http://www.w3.org/2001/XMLSchema#string'
                    }
                  }
                }
              ]
            }
          ],
          name: {
            termType: 'NamedNode',
            value: 'http://wikiba.se/ontology#label'
          },
          silent: false
        }
      ],
      type: 'query',
      prefixes: {
        wd: 'http://www.wikidata.org/entity/',
        wdt: 'http://www.wikidata.org/prop/direct/',
        wikibase: 'http://wikiba.se/ontology#',
        p: 'http://www.wikidata.org/prop/',
        ps: 'http://www.wikidata.org/prop/statement/',
        pq: 'http://www.wikidata.org/prop/qualifier/',
        rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
        bd: 'http://www.bigdata.com/rdf#'
      }
    };

    const generator = new sparqljs.Generator({});
    const generatedQuery = generator.stringify(sparqlObj);
    const url = wdk.sparqlQuery(generatedQuery);
    const {data} = await axios.get(url);
    const simplifiedResults = wdk.simplify.sparqlResults(data);
    console.log(simplifiedResults);
    this.setState({result: simplifiedResults});
  }

  render() {
    const {email} = this.props;
    return (
      <div>
        <h3>Welcome, {email}</h3>
        <ol>
          {this.state.result.map(r => (
            <li key={r.item.value}>{r.item.label}</li>
          ))}
        </ol>
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
