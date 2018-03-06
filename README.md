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

