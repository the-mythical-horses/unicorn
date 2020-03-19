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
    const authorQid = 'Q535';
    const sparqlObj = {
      type: 'query',
      queryType: 'SELECT',
      variables: [{id: '?work'}, {id: '?workLabel'}],
      where: [
        {
          type: 'bgp',
          triples: [
            {
              subject: {id: '?work'},
              predicate: {id: 'http://www.wikidata.org/prop/direct/P50'},
              object: {id: 'http://www.wikidata.org/entity/Q535'}
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
                  subject: {id: 'http://www.bigdata.com/rdf#serviceParam'},
                  predicate: {id: 'http://wikiba.se/ontology#language'},
                  object: {id: '"[AUTO_LANGUAGE],en,fr,cs,esg"'}
                }
              ]
            }
          ],
          name: {id: 'http://wikiba.se/ontology#label'},
          silent: false
        }
      ],
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
    sparqlObj.variables = ['?work', '?workLabel'];
    const generator = new sparqljs.Generator({});
    try {
      const generatedQuery = generator.stringify(sparqlObj);
      console.log(generatedQuery);
    } catch (err) {
      console.log(err);
    }

    const sparql = `
PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX wikibase: <http://wikiba.se/ontology#>
PREFIX p: <http://www.wikidata.org/prop/>
PREFIX ps: <http://www.wikidata.org/prop/statement/>
PREFIX pq: <http://www.wikidata.org/prop/qualifier/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX bd: <http://www.bigdata.com/rdf#>

SELECT ?work ?workLabel WHERE {
  ?work wdt:P50 wd:${authorQid} .
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en,fr,cs,esg". }
}
`;
    const parser = new sparqljs.Parser();
    const parsedQuery = parser.parse(sparql);
    console.log(parsedQuery);

    const url = wdk.sparqlQuery(sparql);
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
            <li key={r.work.value}>{r.work.label}</li>
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
