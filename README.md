# README

This README would normally document whatever steps are necessary to get your application up and running.

### What is this repository for?

- Quick summary
- Version
- [Learn Markdown](https://bitbucket.org/tutorials/markdowndemo)

### How do I get set up?

- Summary of set up
- Configuration
- Dependencies
- Database configuration
- How to run tests
- Deployment instructions

### Contribution guidelines

- Writing tests
- Code review
- Other guidelines

### Who do I talk to?

- Repo owner or admin
- Other community or team contact

### Prettier-formatter usage

After using "npm install" command you will be able to use prettier within the project by running "prettier --write [path]" (for example ./src)

#### VSCode setup onSave formatting

- Install Prettier plugin.
- [VSCode settings] -> search for "defaultFormatter" option and set "esbenp.prettier-vscode"
- [VSCode settings] -> search for "formatOnSave" option and set checkbox to TRUE

#### WebStorm setup onSave formatting

- Prettier plugin should be installed by default
- Settings -> Tools -> File Watchers ->
  - add new watcher (Prettier should be in the list)
  - set "File type: Any"
