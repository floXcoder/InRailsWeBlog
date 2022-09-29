# frozen_string_literal: true

Warden::Manager.after_set_user do |resource, auth, opts|
  scope                                      = opts[:scope]
  auth.cookies.signed["#{scope}.id"]         = { value: resource.id, httponly: true }
  auth.cookies.signed["#{scope}.expires_at"] = { value: 2.hours.from_now, httponly: true }

  auth.cookies["#{scope}.connected_id"] = { value: resource.id, max_age: InRailsWeBlog.settings.session_duration, httponly: false }
end

Warden::Manager.before_logout do |_resource, auth, opts|
  scope                                      = opts[:scope]
  auth.cookies.signed["#{scope}.id"]         = nil
  auth.cookies.signed["#{scope}.expires_at"] = nil

  auth.cookies["#{scope}.connected_id"] = { value: nil, httponly: false }
end
