# InRailsWeBlog [![pipeline status](https://gitlab.l-x.fr/Flo/InRailsWeBlog/badges/develop/pipeline.svg)](https://gitlab.l-x.fr/Flo/InRailsWeBlog/commits/develop) [![coverage report](https://gitlab.l-x.fr/Flo/InRailsWeBlog/badges/develop/coverage.svg)](https://gitlab.l-x.fr/Flo/InRailsWeBlog/commits/develop)

This is a not so simple blog.

Official website based on InRailsWeBlog project: https://www.ginkonote.com

## Functionalities

Main functionalities of InRailsWeBlog blog:

* Write your articles inside topics and classified them with tags
* Multiple article view modes: cards, summary, one-card and inline edition
* Write articles in several languages in only one place
* Three view modes for topics: normal articles, stories (by date) and custom fields (text, date, boolean, ...) 
* Powerful search with ElasticSearch: autocompletion for article title, inside content for full search
* Search inside links reference in articles content
* Translated in 2 languages
* Administration panel integrated to manage and monitor the blog
* SPA website to ease the navigation
* PWA ready (you can install as an app on your smartphone)
* Export in HTML all your articles and data
* Specific SEO cache with included JS generation
* OpenSearch integrated to include as a search engine


## Operating rules

### Users

Each user start with a default private topic, named "Default".

### Topics

All articles are created inside a topic.
A user can create any topics he wants. New articles will be associated to the current topic.

There are two types of topics:
* Default topics: collection of note articles
* Stories topics: collection of story articles, display as a timeline

### Articles

An article contains text, images and links, to other articles or external links.

If parent topic is private, only user tags can be used.
Conversely, if parent topic is public, only shared tags can be used.
An article cannot mix public and private tags.

An article from a private topic can be shared with other users or groups. Or publicly with a dedicated link.

Articles types:
* Note: default mode 
* Story: articles of a stories topic 
* Link: link as title (title is still used for link name)

### Tags

All tags are displayed in a sidebar, sorted by parent tags then children tags.

Each article can be tagged with a tag.
Two categories of tags: parent or child. The association to an article define the order of the tags.

### Search

Search is performed by default in the current topic and look for content in all articles and tags.

### Share

Public topics can share with other users (contributors). Contributors can add or edit articles inside the topic. 

### Group

Groups are a set of users. Every user can subscribe to a group and share specific articles to the group (To be done).

## Inspiration

* Trello: for the view with all notes in the current topic
* Evernote: tags and notes but too closed
* Stack overflow: tags system but too much information and complicated
* Medium: nice UX and SEO but too commercial

## Requirements

* Ruby 3.3
* Rails 8.0
* SQL Database (configured with PostgreSQL)
* A CSS3 / HTML5 compatible Browser (Firefox, Chrome, …)

## Installation

### System dependencies

First install required packages:

    sudo apt-get install -y curl git redis-server postgresql postgresql-contrib libpq-dev zlib1g-dev libssl-dev libreadline-dev libyaml-dev libsqlite3-dev sqlite3 libxml2-dev libxslt1-dev libcurl4-openssl-dev software-properties-common libgdbm-dev libncurses5-dev automake libtool bison libffi-dev libnotify-bin cmake git-flow gawk libgmp-dev libreadline6-dev cmake libpng-dev optipng jpegoptim chromium-driver

Configure git:

    git config --global color.ui true
    git config --global core.autocrlf false
    git config --global core.fileMode false
    git config --global help.autocorrect 1

### Ruby dependencies

Then install rvm and ruby with yjit:

    gpg2 --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 7D2BAF1CF37B13E2069D6956105BD0E739499BDB
    \curl -sSL https://get.rvm.io | bash -s stable
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
    rvm install <ruby version> -C --with-jemalloc --enable-yjit
    
Exit the terminal and launch a new terminal in the root directory of the project. The gemset is automatically created.

Install gems in the gemset of the project:

    gem install bundler
    
    bundle
    
### Database dependencies

Create the postgres user and the dev database:

    sudo -u postgres psql
    postgres=# create user inrailsweblog with password 'inrailsweblog';
    postgres=# alter role inrailsweblog createdb;
    postgres=# createdb inrailsweblog_dev owner inrailsweblog;
    postgres=# \q

### Search dependencies

Install ElasticSearch:

    wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo gpg --dearmor -o /usr/share/keyrings/elasticsearch-keyring.gpg
    sudo apt-get install apt-transport-https
    echo "deb [signed-by=/usr/share/keyrings/elasticsearch-keyring.gpg] https://artifacts.elastic.co/packages/8.x/apt stable main" | sudo tee /etc/apt/sources.list.d/elastic-8.x.list
    sudo apt-get update

Configure ElasticSearch and avoid exposing ES to outside:

    sudo nano /etc/elasticsearch/elasticsearch.yml

    http.host: localhost
    xpack.security.enabled: false
    xpack.security.enrollment.enabled: false

Start ElasticSearch:
    
    sudo systemctl enable elasticsearch
    sudo systemctl start elasticsearch

### Node dependencies

Install NodeJS (through Node Version Manager) and Yarn as package manager:

    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
    nvm install 23
    
    corepack enable
    yarn set version 4.5.3

Install npm packages for the project (Yarn v3 is used for this project):

    yarn

### WYSIWYG editor

Summernote is used for article creation and edition. It's an advanced WYSIWYG editor.

A custom version of Summernote is used for this project.

Here is the procedure to update Summernote:

`cd summernote`
`git fetch && git pull`
`yarn`
`npm run buildall`

Copy `dist/summernote-lite.js` to `app/assets/javascripts/modules/summernote/summernote-lite.js`.
Then remove last line containing `sourceMappingURL`.

If needed, copy also CSS file: `dist/summernote.css` to `app/assets/stylesheets/components/summernote.scss`. And remove all code related to icons.

### Populate database

Populate database with dummy data:

    rails InRailsWeBlog:populate[reset,data]

## Development

### Local

To run development environment run command: 

    bundle exec guard
    
=> http://localhost:3000

### Assets management

All assets (JS, CSS, images and fonts) are generated with Rsbuild tool.

The command to generate assets is:

    npx rsbuild build

Assets are generated inside `public/assets`. In development environment, all the `manifest.json` file is generated locally, otherwise all assets are in memory.

The list of assets are available here:

=> http://localhost:8080/rsbuild-dev-server

To analyze generate assets, use Rsdoctor:

    RSDOCTOR=true npx rsbuild build

Then consult the following webpage:

=> http://localhost:8042/index.html

The important tabs are `Duplicate Packages Viewer` and `Webpack Bundle Analyzer`.


### Project task list

List all available tasks for Rails project :

    rails -T

- Flush Redis keys:


    rails InRailsWeBlog:flush_redis


### Update environment

Check outdated gems:

    bundle outdated --only-explicit --groups

Check outdated NPM packages:

    yarn upgrade-interactive

### Database

Populate with default data:

    rails InRailsWeBlog:populate[reset]

Populate with dummy data:

    rails InRailsWeBlog:populate[reset,dummy]
    
Import/export production data:

    sudo pg_dump --username inrailsweblog --format=custom --file inrailsweblog.sql inrailsweblog

    sudo -u postgres psql

    alter role inrailsweblog superuser;

    DISABLE_DATABASE_ENVIRONMENT_CHECK=1 rails db:drop && rails db:create && rails db:migrate

    pg_restore --username inrailsweblog --clean --dbname inrailsweblog_dev inrailsweblog.sql


### Service worker for PWA (with WorkboxPlugin plugin)

To test the Service Worker in local, you need to follow these steps:

- Enable GenerateSW plugin for development in ./rsbuild.config.mjs
- Uncomment environment check in initialize function of pwaManager in ./app/assets/javascripts/modules/pwaManager.js (Comment _isSubscribedUser call to test for all users)
- Run the server, the ./public/service-worker.js file will be generated when building
- Open the website URL in Chrome browser and check the SW is registered (in Application tab of the console)

### Display emails

Sent email can be seen in two ways:

- In console: the email content is fully display with headers in the console

- In browser with email previewer: http://localhost:3000/rails/mailers/user_mailer

The data parameters can be changed inside each email previewer method

### External tools

#### ElasticSearch

Access in browser:

http://localhost:9200/_plugin/head/

Update all indexes:

    rails InRailsWeBlog:search_reindex

#### Maxminddb

Maxminddb uses a Geolite2 database to fetch location from IP (http://dev.maxmind.com/geoip/geoip2/geolite2).

A cron script update each month the IP database:

    rails InRailsWeBlog:update_geolite

#### Jobs

GoodJob is used for processing background jobs.

Run GoodJob:

    bundle exec goo_job start

#### Redis

Key-value storing tool.

Used to store:
- Sessions
- Cache
- Serializer
- Geocoder

### Coding rules

- CSS: https://github.com/bendc/frontend-guidelines
Ruby/Rails 

- HTML: http://toddmotto.com/writing-the-best-css-when-building-with-html5

### Static Analysis

Run all static analysis tools:

    rails InRailsWeBlog:static_analysis:all

Cron tool to run analysis tools:

    whenever --update-crontab

CSS:

    stylelint

Javascript:

    eslint

### Documentation

Generate documentation:

    bundle rails doc:app

## Test

### Rails tests

Initialize test environment:

    RAILS_ENV=test bin/rails db:setup

Run all tests:

    rspec

### Javascript tests

    npm run test

Or with coverage:

    npm run test:coverage
    
### Static tests

To run all static tests:

    rails InRailsWeBlog:static_analysis:all
    
All results are generated in:

    ./static_analysis/*

## Production

### Deployment

#### Production

https://www.ginkonote.com

Gitlab is used for automatic deployment. Each time a new tag is pushed to master, Gitlab will execute the CI process :

- Build the environment

- Check code: useless traces and audit

- Run rails tests

- Run JS tests

Before the first deployment, establish the server configuration:

    GIT_REPO_ADDRESS="..." GIT_REPO_PORT="..." GIT_REPO_USER="..." DEPLOY_USER="..." DEPLOY_SERVER="..." DEPLOY_USER="..." DEPLOY_GEMSET="..." cap production deploy:check


To deploy automatically using Gitflow (the tag will be incremented):

    rails InRailsWeBlog:deploy
    
To deploy automatically with from a specific tag version:

    rails InRailsWeBlog:deploy TAG=1.0.0

To deploy manually without using Gitlab (commit and deploy first your modification on the remote master branch):

    rails InRailsWeBlog:deploy SKIP_CI=true

- Other commands:


    cap production deploy:restart_jobs
    cap production deploy:restart_web

    cap production rails:console
    cap production rails:console sandbox=1

### Assets generation

All specific environment variables to generate assets must be defined in `./config/application.yml`.

In production environment, run the following command to generate assets inside `./public/assets`:

    npm run production

### Sitemap

In local, run:

    rails InRailsWeBlog:generate_sitemap

For production, run:

    cap production deploy:generate_sitemap

It will generate a new sitemap for each locale inside `./public/sitemaps/` and ping Google in production mode.

## PWA

In production, the website is PWA ready!

You can install the website as a mobile app through Chrome browser.

To customize the PWA settings, edit `public/manifest.json` file and change the following parameters:

- `name` (name of your application)
- `short_name` (name in short)
- `background_color` (background color)
- `theme_color` (main color)

Change also the logo in `public/offline.html` file with your own asset in base64 format.

## Issue tracking

All issues are listed in:

https://gitlab.l-x.fr/Flo/InRailsWeBlog/issues

## Versioning

The project is based on git:

https://gitlab.l-x.fr/Flo/InRailsWeBlog/tree/develop

Gitflow is used for branch management.

### Create major version

To create a new major version, start manually a new Gitflow release named "0.Y.0" or "X.0.0". Next release will increment the minor version (Z).

### Remote repository

    git push -u origin develop
    git push -u origin master
    git push --tags


©FloXcoder - 2025
