class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string      :pseudo,          default: '',    null: false
      t.string      :first_name,      default: ''
      t.string      :last_name,       default: ''
      t.integer     :age,             default: 0
      t.string      :city,            default: ''
      t.string      :country,         default: ''
      t.string      :additional_info, default: ''
      t.string      :locale,          default: 'fr'

      t.text        :preferences,     default: '{}',  null: false
      t.text        :last_request,    default: '{}',  null: false
      t.integer     :current_topic_id

      t.boolean     :admin,           default: false, null: false

      t.string      :slug

      t.datetime    :deleted_at

      t.timestamps null: false
    end

    add_index :users, :pseudo,  where: 'deleted_at IS NULL'
    add_index :users, :slug,    where: 'deleted_at IS NULL'
  end
end
