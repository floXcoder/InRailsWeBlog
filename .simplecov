SimpleCov.start do
    add_filter '/lib/'
    add_filter '/vendor/'
    add_filter '/config/'
    add_filter '/spec/'
    add_filter '/test/'

    add_group 'Controllers',    'app/controllers'
    add_group 'Models',         'app/models'
    add_group 'Helpers',        'app/helpers'
    add_group 'Models',         'app/models'
    add_group 'Policies',       'app/policies'
    add_group 'Queries',        'app/queries'
    add_group 'Serializers',    'app/serializers'
    add_group 'Services',       'app/services'
end if ENV["COVERAGE"]

SimpleCov.coverage_dir('coverage')
