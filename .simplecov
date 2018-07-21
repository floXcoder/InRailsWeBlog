SimpleCov.start do
    add_filter '/lib/'
    add_filter '/vendor/'
    add_filter '/config/'
    add_filter '/spec/'
    add_filter '/test/'

    add_group 'Controllers',    'app/controllers'
    add_group 'Models',         'app/models'
    add_group 'Helpers',        'app/helpers'
    add_group 'Mailers',        'app/mailers'
    add_group 'Models',         'app/models'
    add_group 'Policies',       'app/policies'
    add_group 'Serializers',    'app/serializers'
    add_group 'Uploaders',      'app/uploaders'
    add_group 'Workers',        'app/workers'
end if ENV["COVERAGE"]

SimpleCov.coverage_dir('coverage')
