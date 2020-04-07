[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![License](https://img.shields.io/badge/license-GNU%20AGPLv3-blue)](https://choosealicense.com/licenses/agpl-3.0/)

<h1 style="text-align: center;">Unicorn</h1>

<p style="text-align: center;"><i>Compare Anything</i></p>

Unicorn is a fast, powerful open-source search engine used to compare any two items by leveraging the vast and
awesome power of [Wikidata](https://www.wikidata.org/wiki/Wikidata:Main_Page). Find the connections between anything and everything.

---

## Local Setup

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

Fire up a terminal and run the following commands:

```
git clone https://github.com/the-mythical-horses/unicorn.git
npm install
npm run start
```

---

## How do I use it?

Easy. Simply make your way over to the compare page and insert any two items you wish. Press compare and watch the magic happen!

![](Unicorn-Gif_2.gif)

---

## How does it work?

Unicorn is a client-side application that makes requests to Wikidata’s API. We say ‘client-side’ only to mean that the applications logic, including the API calls and rendering exist solely on the front-end within components.

The process can be broken into three steps:

1. Unicorn queries Wikidata and gathers the relevant item information from APIs.
2. It then makes comparisons between said items on a two-level basis.
3. Lastly, it gathers English labels for the displayed results (all comparisons are done on a language-neutral basis).

We do not store any Wikidata item information in our own database. Only the User’s profile information is stored so as to allow for comparisons. Profile comparisons are done by the exact same procedure as comparing two Wikidata objects with the user’s stored info being stored as a copycat object.

---

## Tech Stack

### Front End:

- [React.js](https://reactjs.org/)
- [Redux.js](https://redux.js.org/)
- [Wikibase-sdk](https://github.com/maxlath/wikibase-sdk)

### Back End:

- [Node.js](https://nodejs.org/en/)
- [Express.js](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)

---

## Challenges Faced

Some challenges faced include:

- Figuring out how to expand on our base functionality, features outside of comparisons.
- Parsing through the data received from our Wikidata API queries so as to make the response human-readable.
- The logic for profile was at first not downstreamed from the root component to display components, causing lots of render issues. We restructured the app to have all logic at the top and passed down, rather than the reverse.

---

## Roadmap

## Contributing

As stated earlier, Unicorn is completely open-source. We are passionate about this project and want to see it grow. We would love any and all contributions. That said here are a few guidelines for contributing:

When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.

Please note we have a code of conduct, please follow it in all your interactions with the project.

### Pull Request Process

1. Ensure any install or build dependencies are removed before the end of the layer when doing a build.

2. Update the README.md file with details of changes to the interface, this includes new environment variables, exposed ports, useful file locations and container parameters. Keep the details clean and concise. No need to write a novel. Just a quick, clear summary of what you've done is fine. When in doubt, look at previous entries for formatting.

3. You may merge the Pull Request in once you have the sign-off of two other developers, or if you do not have permission to do that, you may request the second reviewer to merge it for you.

### Code of Conduct

#### Contribution Standards

Good vibes:

- Using welcoming and inclusive language.
- Being respectful of differing viewpoints and experiences.
- Be humble. Accept constructive criticism.
- Showing empathy towards other community members.

Bad Vibes:

- Trolling, insulting/derogatory comments, and personal or political attacks.
- Public or private harassment.
- Publishing others' private information, such as a physical or electronic address, without explicit permission.
- Other conduct which could reasonably be considered inappropriate in a professional setting.

---

## Support

If you need to reach us:

petesamper@gmail.com

habs@sdf.org

## License

GNU AGPLv3

See the LICENSE.md file for details.
