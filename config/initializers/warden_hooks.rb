# frozen_string_literal: true

Warden::Manager.after_set_user do |resource, auth, opts|
  scope = opts[:scope]
  auth.cookies.signed["#{scope}.id"] = resource.id
  auth.cookies.signed["#{scope}.expires_at"] = 2.hours.from_now
end

Warden::Manager.before_logout do |_resource, auth, opts|
  scope = opts[:scope]
  auth.cookies.signed["#{scope}.id"] = nil
  auth.cookies.signed["#{scope}.expires_at"] = nil
end
