import React from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import {addComment} from '../store';

class Comments extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      comments: [],
      body: '',
      q1: '',
      q2: ''
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidUpdate() {
    if (
      this.props.q1 !== undefined &&
      this.props.q2 !== undefined
      //   this.props.q1 !== this.state.q1) ||
      // this.props.q2 !== this.state.q2
    ) {
      // this.setState({
      //   comments: data,
      //   q1: this.props.q1,
      //   q2: this.props.q2
      // });
    }
  }

  onChange(evt) {
    this.setState({body: evt.target.value});
  }

  onSubmit(evt) {
    evt.preventDefault();
    console.log(this.props.q1, this.props.q2);
    this.props.addComment(this.props.q1, this.props.q2, this.state.body);
    this.setState({
      body: ''
    });
  }

  render() {
    if (this.props.q1 && this.props.q2) {
      return (
        <div>
          <div>
            {this.props.comments.map(comment => (
              <p key={comment.id}>
                <b>
                  {comment.user.email} ({comment.date}):{' '}
                </b>
                {comment.body}
              </p>
            ))}
          </div>
          <div className="row">
            {this.props.user.id && (
              <form onSubmit={this.onSubmit} className="col s12">
                <div className="row">
                  <div className="input-field col s12">
                    <textarea
                      onChange={this.onChange}
                      id="textarea1"
                      className="materialize-textarea"
                      value={this.state.body}
                    ></textarea>
                    <label htmlFor="textarea1">Add a comment</label>
                  </div>
                  <button type="submit">Submit</button>
                </div>
              </form>
            )}
          </div>
        </div>
      );
    } else {
      return <div></div>;
    }
  }
}

const mapState = state => {
  return {
    user: state.user,
    comments: state.comments
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addComment: (q1, q2, comment) => {
      return dispatch(addComment(q1, q2, comment));
    }
  };
};

export default connect(mapState, mapDispatchToProps)(Comments);
