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
      submitted: {
        qname1: '',
        qname2: '',
        leftQSearch: '',
        rightQSearch: ''
      }
    };
    this.onChangeLeft = this.onChangeLeft.bind(this);
    this.onChangeRight = this.onChangeRight.bind(this);

    this.onSubmit = this.onSubmit.bind(this);
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

  async onSubmit(evt) {
    evt.preventDefault();
    this.setState({
      submitted: {
        qname1: this.state.form.qname1,
        qname2: this.state.form.qname2,
        leftQSearch: this.state.leftQSearch,
        rightQSearch: this.state.rightQSearch
      },
      leftSearch: [],
      rightSearch: []
    });
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
        <CompareDisplay submitted={this.state.submitted} />
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
