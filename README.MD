# The MoBB 
*The Map of Black Businesses* (_MoBB_) is a tool to practice group economics. The application allows for consumers to immediately identify black owned businesses (_BoBs_) in their vicinity (or search another area on the map); with the goal of growing The Community's economy.

_Assumption: If we drive more customers to BoBs, they in turn will bank with Black Banks, who will reinvest in small BoBs and projects which benefit The Community._
<!--- These are examples. See https://shields.io for others or to customize this set of shields. You might want to include dependencies, project status and license info here --->
![Github License](https://img.shields.io/github/license/tdotholla/mobb_v0)
![Node Version](https://img.shields.io/node/v/canary)
![W3C Validation](https://img.shields.io/w3c-validation/default?targetUrl=https%3A%2F%2Fmobb.kielbyrne.com)

![GitHub repo size](https://img.shields.io/github/repo-size/tdotholla/mobb_v0)
![Github code size](https://img.shields.io/github/languages/code-size/tdotholla/mobb_v0)
![Github Languages](https://img.shields.io/github/languages/count/tdotholla/mobb_v0)
![Github Top Language](https://img.shields.io/github/languages/top/tdotholla/mobb_v0)

![GitHub Issues](https://img.shields.io/github/issues-raw/tdotholla/mobb_v0)
![GitHub contributors](https://img.shields.io/github/contributors/tdotholla/mobb_v0)
![Github Last Commit](https://img.shields.io/github/last-commit/tdotholla/mobb_v0)
<!--

![Github Commit Activity](https://img.shields.io/github/commit-activity/m/tdotholla/mobb_v0)
![GitHub stars](https://img.shields.io/github/stars/tdotholla/mobb_v0?style=social)
![GitHub forks](https://img.shields.io/github/forks/tdotholla/mobb_v0?style=social)
![Github Manifest Version](https://img.shields.io/github/manifest-json/v/tdotholla/mobb_v0)

-->

### **_Visit [MoBB.kielbyrne.com](https://MoBB.kielbyrne.com)_**

## Prerequisites

Before you begin, ensure you have met the following requirements:
* You have installed the latest version of `node`, and `yarn`.
* You have a `<Windows/Linux/Mac>` machine. (I have not tested on Linux, but should work fine)
* You have read [SUPPORT.md](SUPPORT.md).


## Architecture
- This is a legacy `meteor` application, build in version 1.10 Alongside MongoDB
- Google Maps API 
- opengraph.io API
- Google / Facebook oAuth packages (meteorite)
- Materialize-CSS (v.0.1.0)
- Orion CMS package (meteorite)

#### Getting Started Developing:
 - Fork/Clone Repo
 - Obtain `settings-dev.json` from existing developer (or touch a new file and populate with your API keys for required services)
 - Install [meteor.js](https://docs.meteor.com/#/full/)
   - OSX/Linux: `curl https://install.meteor.com/ | sh`
   - Windows: `choco install meteor`
 - `meteor npm install` to install meteor packages & dependencies
   - may need to build node-gyp? [node-gyp docs](https://github.com/nodejs/node-gyp) due to the [fourseven:scss](https://github.com/Meteor-Community-Packages/meteor-scss#compatibility) meteorite package
 - `npm run dev` or `yarn dev` to start local server (`localhost:3000`)
 - Login as user {`rnr@iam.com:password`} (before setting up google/facebook oAuth)
 - Click ADD button and add first business to your local DB. (Congrats!!🎉)
 - Search the code for the MoBB admin user to login to the admin console (`localhost:3000/admin`) 

**_Documentation links can be found in [SUPPORT](SUPPORT.md)_**


## Contributing

### _First off, thank you for considering contributing to The MoBB. It’s people like you that make The MoBB such a great tool._ 🥂

1. [Fork](https://github.com/tdotholla/mobb_v0.git) this repo
2. Create a branch: `git checkout -b <branch_name>` (feature? bug?).
3. Make your changes and commit them: `git commit -m '<commit_message>'`
4. Push to the original branch: `git push origin <project_name>/<location>`
5. Create the [pull request](). **(Don't forget to [test!](https://www.npmjs.com/package/zora))**

## Contributors

#### Thanks to the following people who have contributed to this project:

* [@DevCollectiv](https://github.com/DevCollectiv) 📖💻🤔⚠️
* [@tmanundercover](https://github.com/tmanundercover) 🐛💻🤔👀⚠️
* [@tdblackston0](https://github.com/tdblackston0) 🐛🤔👀⚠️
* [@ludakhris](https://github.com/ludakhris) 💬🐛💻🤔👀⚠️


## Licenses

Content is released under [Mozilla Public License Version 2.0](). See [LICENSE.md](LICENSE.MD) for complete details, including attribution guidelines, contribution terms, and software and third-party licenses and permissions.

### Roadmap as user stories

- [x] _As an end-user, I would like to see the locations of black owned businesses near me, on a map_
- [ ] _I would like to see the one closest business to me, at all times_
- [x] _I would like to see details of the busineses shown on the map_
- [ ] _I would like to become a registered user_
- [ ] _I would like to get directions to the business I am viewing_
- [ ] _As a registered user, I would like to add a business to the map_
- [ ] _As a registered user, I would like to modify business I am viewing_
- [ ] _The map and business details should be current_

### Branches:

Try to name branches in a descriptive way, `master`, `ft-<featureName>`, `fix-<fixName>`, etc...
**No pull requests will be merged into `master` branch.**

### Resources:

[Github Contribution setup](https://help.github.com/en/github/building-a-strong-community/setting-up-your-project-for-healthy-contributions)
