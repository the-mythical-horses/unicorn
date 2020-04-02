import React from 'react';
import {Link} from 'react-router-dom';

const about = () => {
  return (
    <div id="about-page">
      <div id="about-content">
        <div className="about-box">
          <h3 className="about-header">About Our Website</h3>
          <div id="about-website">
            <p id="about-par">
              Unicorn is a comparative engine designed to help us all better
              understand our complicated world and all of its inhabitants.
              Choose anything to compare &mdash; your two favorite celebrities,
              planets in the solar system, cartoon characters, DNA strands, or
              stars in the sky. Take a look at our{' '}
              <Link href="/home">featured page</Link> for some inspiration. And
              once you're done playing with objects you know, feel free to build
              up <Link href="/profile">your profile</Link> and see what you
              yourself may have in common with your idols, enemies, and
              everything in between.
            </p>

            <p id="about-par">
              We make use of{' '}
              <a href="https://www.wikidata.org/wiki/Wikidata:Main_Page">
                Wikidata's dataset
              </a>{' '}
              for the majority of our queries, giving us access to over
              85,000,000 real-world items in the public domain. We use{' '}
              <a href="https://commons.wikimedia.org/wiki/Main_Page">
                Wikimedia Commons
              </a>{' '}
              to source freely-licensed images for our subjects used in
              comparisons. Our algorithm makes dozens of requests to these APIs
              on every comparison based on several factors to determine
              similarity and find as many points of commonality as possible. We
              hope you enjoy comparing with Unicorn!
            </p>
          </div>
        </div>

        <div className="about-box">
          <h3 className="about-header">About Ourselves</h3>

          <div className="about-us">
            <div className="elisCard" id="leftCard about-card">
              <div className="smallTitleLeft" id="about-card-headers">
                Harry
              </div>
              <div className="smallSubTitle">Software engineer</div>
              <img className="compare-img" src="/img/harry_400.jpg" />
              <div className="smallPictureDescription">
                Passionate about data
              </div>
              <div className="smallInfo">
                <div className="smallInfoTitleLeft" id="about-card-headers">
                  Information
                </div>
                <div className="smallInfoMain">
                  <div className="theSmalls">
                    <div className="smallInfoH">operating system used</div>
                    <div className="smallInfoD">
                      <a href="https://www.wikidata.org/wiki/Q3251801">
                        GNU/Linux
                      </a>
                    </div>
                  </div>
                  <div className="theSmalls">
                    <div className="smallInfoH">languages spoken or signed</div>
                    <div className="smallInfoD">
                      <a href="https://www.wikidata.org/wiki/Q1860">English</a>,{' '}
                      <a href="https://www.wikidata.org/wiki/Q7838">Swahili</a>
                    </div>
                  </div>
                  <div className="theSmalls">
                    <div className="smallInfoH">5000m personal best</div>
                    <div className="smallInfoD">1033 seconds</div>
                  </div>
                  <div className="theSmalls">
                    <div className="smallInfoH">height</div>
                    <div className="smallInfoD">6 foot 1 inch</div>
                  </div>
                  <div className="theSmalls">
                    <div className="smallInfoH">shoe size</div>
                    <div className="smallInfoD">13</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="elisCard" id="leftCard about-card">

              <div className="smallTitleLeft" id="about-card-headers">
                Pete
              </div>

              <div className="smallSubTitle">Software engineer</div>
              <img className="compare-img" src="/img/Pete_Photo.jpg" />
              <div className="smallPictureDescription">
                Developer | Veteran | Coffee enthusiast
              </div>
              <div className="smallInfo">
                <div className="smallInfoTitleLeft" id="about-card-headers">
                  Information
                </div>
                <div className="smallInfoMain">
                  <div className="theSmalls">
                    <div className="smallInfoH">operating system used</div>
                    <div className="smallInfoD">
                      <a href="https://www.wikidata.org/wiki/Q43627">macOS</a>
                    </div>
                  </div>
                  <div className="theSmalls">
                    <div className="smallInfoH">languages spoken or signed</div>
                    <div className="smallInfoD">
                      <a href="https://www.wikidata.org/wiki/Q1860">English</a>
                    </div>
                  </div>
                  <div className="theSmalls">
                    <div className="smallInfoH">Favorite Game:</div>
                    <div className="smallInfoD">
                      Everything made by{' '}
                      <a href="https://www.wikidata.org/wiki/Q2414469">
                        FromSoftware
                      </a>
                    </div>
                  </div>
                  <div className="theSmalls">
                    <div className="smallInfoH">Height</div>
                    <div className="smallInfoD">6'</div>
                  </div>
                  <div className="theSmalls">
                    <div className="smallInfoH">shoe size</div>
                    <div className="smallInfoD">11</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="elisCard" id="leftCard about-card">
              <div className="smallTitleLeft" id="about-card-headers">
                Eli
              </div>
              <div className="smallSubTitle">Software Engineer</div>
              <img className="compare-img" id="elis-image" src="/img/eli.jpg" />
              <div className="smallPictureDescription">
                Eli Plutchok smiles for the camera.
              </div>
              <div className="smallInfo">
                <div className="smallInfoTitleLeft" id="about-card-headers">
                  Information
                </div>
                <div className="smallInfoMain">
                  <div className="theSmalls">
                    <div className="smallInfoH">Birthplace</div>
                    <div className="smallInfoD">Brooklyn, NY</div>
                  </div>
                  <div className="theSmalls">
                    <div className="smallInfoH">Height</div>
                    <div className="smallInfoD">6'3</div>
                  </div>
                  <div className="theSmalls">
                    <div className="smallInfoH">Languages spoken</div>
                    <div className="smallInfoD">
                      <a href="https://www.wikidata.org/wiki/Q1860">English</a>,{' '}
                      <a href="https://www.wikidata.org/wiki/Q9288">Hebrew</a>
                    </div>
                  </div>
                  <div className="theSmalls">
                    <div className="smallInfoH">Favorite Food</div>
                    <div className="smallInfoD">Pizza</div>
                  </div>
                  <div className="theSmalls">
                    <div className="smallInfoH">Country of citizenship</div>
                    <div className="smallInfoD">United States of America</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default about;
