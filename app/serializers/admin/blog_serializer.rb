# frozen_string_literal: true

# == Schema Information
#
# Table name: admin_blogs
#
#  id         :bigint           not null, primary key
#  admin_id   :bigint           not null
#  visibility :integer          default(0), not null
#  title      :string           not null
#  content    :text             not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#


class Admin::BlogSerializer
  include FastJsonapi::ObjectSerializer

  set_type :blog

  # cache_options enabled: true, cache_length: InRailsWeBlog.config.cache_time

  set_key_transform :camel_lower

  attributes :id,
             :admin_id,
             :title,
             :content,
             :visibility

end
