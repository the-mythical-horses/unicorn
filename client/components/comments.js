import React from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import {addComment} from '../store';

class Comments extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      comment: ''
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(evt) {
    this.setState({comment: evt.target.value});
  }

  onSubmit(evt) {
    evt.preventDefault();
    console.log(this.props.q1, this.props.q2);
    this.props.addComment(this.props.q1, this.props.q2, this.state.comment);
    this.setState({
      comment: ''
    });
  }

  render() {
    if (this.props.q1 && this.props.q2) {
      return (
        <div id="comments-div">
          <h5 id="comments-title">Comments</h5>
          <div className="row">
            {this.props.user.id && (
              <form onSubmit={this.onSubmit} className="col s12">
                <div className="row">
                  <div className="input-field col s12">
                    <textarea
                      onChange={this.onChange}
                      id="textarea1"
                      className="materialize-textarea"
                      value={this.state.comment}
                    ></textarea>
                    <label htmlFor="textarea1">Add a comment</label>
                  </div>
                  <button type="submit">Submit</button>
                </div>
              </form>
            )}
          </div>
          <div>
            {this.props.comments.map(comment => (
              <div key={comment.id} className="comment">
                <div className="comment-user">
                  <div>
                    <b>{comment.user.email}</b>
                  </div>
                  <div>{comment.date}</div>
                </div>
                <div className="comment-comment">{comment.comment}</div>
              </div>
            ))}
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
