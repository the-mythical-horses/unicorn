import React from 'react';

const about = () => {
  return (
    <div id="about-page">
      <div id="about-content">
        <div className="about-box">
          <h3 className="about-header">ABOUT OUR WEBSITE</h3>
          <div id="about-website">content</div>
        </div>

        <div className="about-box">
          <h3 className="about-header">ABOUT OURSELVES</h3>

          <div className="about-us">
            <div className="elisCard" id="leftCard about-card">
              <div className="smallTitleLeft">Harry</div>
              <div className="smallSubTitle">Software engineer</div>
              <img className="compare-img" src="/img/harry_400.jpg" />
              <div className="smallPictureDescription">
                Passionate about data
              </div>
              <div className="smallInfo">
                <div className="smallInfoTitleLeft">Information</div>
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
              <div className="smallTitleLeft">Peter</div>
              <div className="smallSubTitle">Software engineer</div>
              <img className="compare-img" src="/img/Pete_Photo.jpg" />
              <div className="smallPictureDescription">
                Developer | Veteran | Coffee enthusiast
              </div>
              <div className="smallInfo">
                <div className="smallInfoTitleLeft">Information</div>
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
              <div className="smallTitleLeft">Eli</div>
              <div className="smallSubTitle">American actor and producer</div>
              <img
                className="compare-img"
                src="https://upload.wikimedia.org/wikipedia/commons/d/d0/TomHanksJan2009.jpg"
              />
              <div className="smallPictureDescription">
                <a
                  href="https://en.wikipedia.org/wiki/Tom_Hanks"
                  className="extiw"
                  title="en:Tom Hanks"
                >
                  Tom Hanks
                </a>{' '}
                recites the orchestral work "Lincoln Portrait," written by Aaron
                Copland, at the Lincoln Memorial on the National Mall in
                Washington, D.C., January 18, 2009, during the inaugural opening
                ceremonies. More than 5,000 men and women in uniform are
                providing military ceremonial support to the presidential
                inauguration for Barack Obama, a tradition dating back to George
                Washington's 1789 inauguration.
              </div>
              <div className="smallInfo">
                <div className="smallInfoTitleLeft">Information</div>
                <div className="smallInfoMain">
                  <div className="theSmalls">
                    <div className="smallInfoH">Commons category</div>
                    <div className="smallInfoD">Tom Hanks</div>
                  </div>
                  <div className="theSmalls">
                    <div className="smallInfoH">VIAF ID</div>
                    <div className="smallInfoD">19874894</div>
                  </div>
                  <div className="theSmalls">
                    <div className="smallInfoH">
                      International Standard Name Identifier
                    </div>
                    <div className="smallInfoD">0000 0001 2123 2378</div>
                  </div>
                  <div className="theSmalls">
                    <div className="smallInfoH">occupation</div>
                    <div className="smallInfoD">
                      film actor, film director, actor, film producer, writer,
                      voice actor, screenwriter, composer, character actor,
                      television actor, television director, television producer
                    </div>
                  </div>
                  <div className="theSmalls">
                    <div className="smallInfoH">country of citizenship</div>
                    <div className="smallInfoD">
                      United States of America, Greece
                    </div>
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
