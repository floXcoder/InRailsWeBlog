SimpleCov.start do
    add_filter '/lib/'
    add_filter '/vendor/'
    add_filter '/config/'
    
    add_group 'Controllers',    'app/controllers'
    add_group 'Decorators',     'app/decorators'
    add_group 'Models',         'app/models'
    add_group 'Helpers',        'app/helpers'
    add_group 'Mailers',        'app/mailers'
    add_group 'Models',         'app/models'
    add_group 'Policies',       'app/policies'
    add_group 'Uploaders',      'app/uploaders'
    add_group 'Workers',        'app/workers'
    
    add_group 'Spec',           'spec'
    add_group 'Test',           'test'
    
end if ENV["COVERAGE"]

SimpleCov.coverage_dir('static_analysis')