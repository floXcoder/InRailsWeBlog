# InRailsWeBlog

This is a not so simple blog.

## Operating rules

### Users

Each user start with a default topic.

### Topics

All articles are created inside a topic.
A user can create any topic he wants. All articles will be associated tot the current topic

### Articles

An article contains text, images and links to other articles or external links.

### Tags

Each article can be tagged with a tag.
The first tag will be the main (or parent) tag for the current article. Other tags will be the children tags.

All tags are displayed in a sidebar, sorted by parent tags then children tags.

### Search

Search is performed by default in the current topic and look for content in all articles and tags.

### Group

Groups are a set of users. Every user can subscribe to a group and share specific articles to the group.

## Inspiration

* Trello: for the view with all notes in the current topic (clear)
* Evernote: tags and notes but too closed
* Stack overflow: tags system but too many information and complicated

## Requirements

* Rails 5.0.1
* SQL Database
* A CSS3 / HTML5 compatible Browser (Firefox, Chrome…)

## Installation

### System dependencies

First install required packages:

    sudo apt-get install -y curl git redis-server postgresql postgresql-contrib libpq-dev zlib1g-dev libssl-dev libreadline-dev libyaml-dev libsqlite3-dev sqlite3 libxml2-dev libxslt1-dev libcurl4-openssl-dev python-software-properties libgdbm-dev libncurses5-dev automake libtool bison libffi-dev libnotify-bin cmake git-flow gawk libgmp-dev libreadline6-dev cmake libpng-dev

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

    sudo wget -qO - https://packages.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
     echo "deb http://packages.elastic.co/elasticsearch/2.x/debian stable main" | sudo tee -a /etc/apt/sources.list.d/elasticsearch-2.x.list
     sudo apt-get update
     sudo apt-get install elasticsearch

Configure ElasticSearch:

    sudo nano /etc/elasticsearch/elasticsearch.yml
    cluster.name: elasticsearch
    network.host: localhost
    
    sudo systemctl enable elasticsearch

### Node dependencies

Install NodeJS and Yarn as package manager:

    curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
    
    sudo apt-get update

    sudo apt-get install -y nodejs yarn

    sudo npm i -g gulp eslint

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

### Task manager: Gulp

List all gulps tasks:

    gulp --tasks

### Database

Populate with default data:

    rails InRailsWeBlog:populate[reset]

Populate with dummy data:

    rails InRailsWeBlog:populate[reset,dummy]

### External tools

#### Elastic Search

Access in browser:

http://localhost:9200/_plugin/head/

Update all indexes:

    rake searchkick:reindex:all
    
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

    rake InRailsWeBlog:static_analysis:all
    
Cron tool to run analysis tools:

    whenever --update-crontab

CSS:

    scss-lint

Javascript:

    eslint

### Documentation

Generate documentation:

    bundle rake doc:app

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

https://www.inrailsweblog.fr

    rails InRailsWeBlog:deploy ENV=prod NO_TEST=true

- Gulp:


    gulp webpack:production --env=production

- Other commands:


    cap production passenger:restart
    
    cap production sidekiq:restart
    cap production sidekiq:start
    cap production sidekiq:stop   
    
    cap production rails:console
    cap production rails:console sandbox=1

### Gulp

Run in production:

    gulp production

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

### Remote repository

    git push -u origin develop
    git push -u origin master
    git push --tags


©FloXcoder - 2018

