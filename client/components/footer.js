import React, {useEffect} from 'react';
import M from 'materialize-css';

const Footer = () => {
  useEffect(() => {
    M.AutoInit();
  });

  return (
    <div className="footer-container">
      <footer className="footer">
        <div>Copyright © 2020 Unicorn</div>
        <div className="gh-button">
          <a href="https://github.com/the-mythical-horses/unicorn">
            <img id="git-logo" src="./iconfinder_github_1390302.png" />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
