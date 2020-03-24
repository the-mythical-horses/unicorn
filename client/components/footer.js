import React, {useEffect} from 'react';
import M from 'materialize-css';

const Footer = () => {
  useEffect(() => {
    M.AutoInit();
  });

  return (
    <div className="footer-container">
      <footer className="footer">
        <div className="gh-button">
          <a href="https://github.com/the-mythical-horses/unicorn">
            <img src="./GitHub-Mark-64px.png" />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
