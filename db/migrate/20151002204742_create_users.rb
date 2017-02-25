class CreateUsers < ActiveRecord::Migration[5.0]
  def change
    create_table :users do |t|
      t.string      :pseudo,          default: '',    null: false
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
      t.string      :locale,          default: 'fr'

      t.jsonb       :preferences,     default: '{}',  null: false

      t.integer     :current_topic_id

      t.boolean     :admin,           default: false, null: false

      t.string      :slug

      t.datetime    :deleted_at

      t.timestamps
    end

    add_index :users, :pseudo,  where: 'deleted_at IS NULL'
    add_index :users, :slug,    where: 'deleted_at IS NULL',  unique: true
  end
end
