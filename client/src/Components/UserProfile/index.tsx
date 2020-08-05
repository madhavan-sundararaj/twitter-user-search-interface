import { CircularProgress } from '@material-ui/core';
import axios from 'axios';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tweet } from 'react-twitter-widgets';
import './style.css';

export default function UserProfile({ match }) {
  const selector = useSelector((state: any) => state.usersSearch);
  const [searchedUser, setSearchedUser] = React.useState({
    followers_count: '',
    name: '',
    profile_image_url_https: '',
    screen_name: '',
    tweets: [{ id_str: '' }],
  });

  const dispatch = useDispatch();

  React.useEffect(() => {
    axios
      .get('/api/user', {
        params: {
          userId: match.params.userId,
        },
      })
      .then((response) => {
        setSearchedUser(response.data.response);
      })
      .catch((error) => {
        dispatch({
          type: 'SET_ERROR',
          payload: error.response.data.message,
        });
      });

    return () => {
      dispatch({
        type: 'RESET_SEARCH_RESULT',
      });
    };
  }, []);

  return (
    <div className="profile-wrapper">
      {selector.error ? (
        <div className="error-message">{selector.errorMessage}</div>
      ) : searchedUser.name !== '' ? (
        <div>
          <img
            src={searchedUser.profile_image_url_https.replace('_normal', '')}
            className="user-avatar"
          />
          <div>
            <h1>{searchedUser.name}</h1>
            <h2>@{searchedUser.screen_name}</h2>
            <h3>{searchedUser.followers_count} followers</h3>
          </div>
          <div className="tweet-container">
            {searchedUser.tweets.map((tweet, i) => (
              <div key={i} className="tweet-wrapper">
                <Tweet tweetId={tweet.id_str} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <CircularProgress />
        </div>
      )}
    </div>
  );
}
