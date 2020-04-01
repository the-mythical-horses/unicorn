import React from 'react';
import axios from 'axios';
import {connect} from 'react-redux';

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

  async componentDidMount() {
    if (
      (this.props.q1 !== undefined &&
        this.props.q2 !== undefined &&
        this.props.q1 !== this.state.q1) ||
      this.props.q2 !== this.state.q2
    ) {
      const {data} = await axios.get(
        `/api/comments/${this.props.q1}/${this.props.q2}`
      );
      this.setState({
        comments: data,
        q1: this.props.q1,
        q2: this.props.q2
      });
    }
  }

  onChange(evt) {
    this.setState({body: evt.target.value});
  }

  async onSubmit(evt) {
    evt.preventDefault();
    const {data} = await axios.post('/api/comments', {
      q1: this.props.q1,
      q2: this.props.q2,
      body: this.state.body
    });
    this.setState({
      comments: [...this.state.comments, data],
      body: ''
    });
  }

  render() {
    return (
      <div>
        <div>
          {this.state.comments.map(comment => (
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
                  <label htmlFor="textarea1">Textarea</label>
                </div>
                <button type="submit">Submit</button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }
}

const mapState = state => ({
  user: state.user
});

export default connect(mapState)(Comments);
