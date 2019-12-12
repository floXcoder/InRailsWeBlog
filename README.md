# InRailsWeBlog [![pipeline status](https://gitlab.l-x.fr/Flo/InRailsWeBlog/badges/develop/pipeline.svg)](https://gitlab.l-x.fr/Flo/InRailsWeBlog/commits/develop) [![coverage report](https://gitlab.l-x.fr/Flo/InRailsWeBlog/badges/develop/coverage.svg)](https://gitlab.l-x.fr/Flo/InRailsWeBlog/commits/develop)

This is a not so simple blog.

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

Public topics can shared with other users (contributors). Contributors can add or edit articles inside the topic. 

### Group

Groups are a set of users. Every user can subscribe to a group and share specific articles to the group (To be done).

## Inspiration

* Trello: for the view with all notes in the current topic (clear)
* Evernote: tags and notes but too closed
* Stack overflow: tags system but too many information and complicated

## Requirements

* Rails 5.2
* SQL Database
* A CSS3 / HTML5 compatible Browser (Firefox, Chrome, …)

## Installation

### System dependencies

First install required packages:

    sudo apt-get install -y curl git redis-server postgresql postgresql-contrib libpq-dev zlib1g-dev libssl-dev libreadline-dev libyaml-dev libsqlite3-dev sqlite3 libxml2-dev libxslt1-dev libcurl4-openssl-dev software-properties-common libgdbm-dev libncurses5-dev automake libtool bison libffi-dev libnotify-bin cmake git-flow gawk libgmp-dev libreadline6-dev cmake libpng-dev optipng jpegoptim chromedriver

Configure git:

    git config --global color.ui true
    git config --global core.autocrlf false
    git config --global core.fileMode false
    git config --global help.autocorrect 1

### Ruby dependencies

Then install rvm:

    gpg2 --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3
    curl -sSL https://get.rvm.io | bash -s stable --ruby
    
Exit the terminal and launch a new terminal in the root directory of the project. The gemset is automatically created.

Install gems in the gemset of the project:

    gem install bundler
    
    bundle
    
Install for all gemset scss-lint:

    rvm @default do gem install scss-lint
    
### Database dependencies

Create the postgres user:

    sudo -u postgres psql
    postgres=# create user inrailsweblog with password 'inrailsweblog';
    postgres=# alter role inrailsweblog createdb;
    postgres=# \q

### Search dependencies

Install ElasticSearch:

    wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
    echo "deb https://artifacts.elastic.co/packages/6.x/apt stable main" | sudo tee -a /etc/apt/sources.list.d/elastic-6.x.list
    sudo apt-get update
    sudo apt-get install elasticsearch

Configure ElasticSearch:

    sudo nano /etc/elasticsearch/elasticsearch.yml
    cluster.name: elasticsearch
    network.host: localhost

Start ElasticSearch:
    
    sudo systemctl enable elasticsearch

### Node dependencies

Install NodeJS and Yarn as package manager:

    curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
    
    sudo apt-get update

    sudo apt-get install -y nodejs yarn

    sudo npm i -g webpack eslint

Install npm packages for the project:

    yarn

### Test dependencies

Install tidy-html5 (check HTML file validity):

    git clone https://github.com/w3c/tidy-html5
    cd tidy-html5
    cd build/cmake
    cmake ../..
    make
    sudo make install
    cd ../../..
    rm -rf tidy-html5/

### Populate database

Populate database with dummy data:

    rails InRailsWeBlog:populate[reset,data]

## Development

### Local

To run development environment run command: 

    bundle exec guard
    
http://localhost:3000

### Project task list

List all available tasks for Rails project :

    rails -T

- Flush Redis keys:


    rails InRailsWeBlog:flush_redis

- SEO:


    rails InRailsWeBlog:seo

- Update counter cache:


    rails InRailsWeBlog:update_counter_cache

### Update environment

Check outdated gems:

    bundle outdated --groups

Check outdated npm packages:

    yarn outdated

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


### External tools

#### Elastic Search

Access in browser:

http://localhost:9200/_plugin/head/

Update all indexes:

    rails searchkick:reindex:all

#### Maxminddb

Maxminddb uses a Geolite2 database to fetch location from IP (http://dev.maxmind.com/geoip/geoip2/geolite2).

A cron script update each month the IP database:

    rails InRailsWeBlog:update_geolite

#### Sidekiq

Background processing tool.

Run Sidekiq:

    bundle exec sidekiq

#### Redis

Key-value storing tool.

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

    scss-lint

Javascript:

    eslint

### Documentation

Generate documentation:

    bundle rails doc:app

## Test

### Rails tests

Initialize test environment:

    RAILS_ENV=test bin/rails db:setup

Basic tests:

    rspec -t basic

Advanced tests (with HTML):

    rspec -t advanced

### Javascript tests

    npm run test

Or with coverage:

    npm run test:coverage

## Production

### Deployment

Two productions environment are available:

#### Production

https://www.inrailsweblog.com

Gitlab is used for automatic deployment: 

- Push new modifications on develop branch, Gitlab will build and run tests on this branch. **Do not forget to push tags when deploying a new version.**

- Create a new Gitflow Release version and push modifications on master branch to deploy on website. Increment each time the version number.


- To deploy manually:


    rails InRailsWeBlog:deploy ENV=prod NO_TEST=true

- After the first deployment, executes the cron tasks:


    RAILS_ENV=production bundle exec rails InRailsWeBlog:update_geolite --silent
    RAILS_ENV=production bundle exec rails InRailsWeBlog:generate_sitemap --silent

- Other commands:


    cap production passenger:restart

    cap production sidekiq:restart
    cap production sidekiq:start
    cap production sidekiq:stop

    cap production rails:console
    cap production rails:console sandbox=1

### Webpack assets

Run in production:

    npm run production

### Sidekiq

Run in production:

    RAILS_ENV=production bundle exec sidekiq -d

## Issue tracking

All issues are listed in:

https://gitlab.l-x.fr/Flo/InRailsWeBlog/issues

## Versionning

The project is based on git:

https://gitlab.l-x.fr/Flo/InRailsWeBlog/tree/develop

Gitflow is used for branch management.

### Create major version

To create a new major version, start manually a new Gitflow release named "0.Y.0" or "X.0.0". Next release will increment the minor version (Z).

### Remote repository

    git push -u origin develop
    git push -u origin master
    git push --tags


©FloXcoder - 2019

