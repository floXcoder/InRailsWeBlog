class CreateUsers < ActiveRecord::Migration[5.0]
  def change
    create_table :users do |t|
      t.string      :pseudo,          null: false,    default: ''
      t.string      :first_name
      t.string      :last_name
      t.string      :street
      t.string      :city
      t.string      :postcode
      t.string      :state
      t.string      :country
      t.string      :mobile_number
      t.string      :phone_number
      t.string      :additional_info
      t.date        :birth_date
      t.string      :locale,                          default: 'fr'

      t.jsonb       :settings,        null: false,    default: {}
      t.boolean     :allow_comment,   null: false,    default: true
      t.integer     :visibility,      null: false,    default: 0

      t.integer     :current_topic_id

      t.integer     :pictures_count,                  default: 0
      t.integer     :topics_count,                    default: 0
      t.integer     :articles_count,                  default: 0
      t.integer     :tags_count,                      default: 0
      t.integer     :bookmarks_count,                 default: 0
      t.integer     :comments_count,                  default: 0

      t.string      :slug

      t.datetime    :deleted_at

      t.timestamps
    end

    add_index :users, :pseudo,  where: 'deleted_at IS NULL'
    add_index :users, :slug,    where: 'deleted_at IS NULL',  unique: true
  end
end
