class CreateSeoDatas < ActiveRecord::Migration[6.0]
  def change
    create_table :seo_datas do |t|
      t.integer :name,                      null: false
      t.string  :locale,                    null: false
      t.string  :parameters,                null: false,    default: [], array: true

      t.jsonb   :page_title_translations,   null: false,    default: {}
      t.jsonb   :meta_desc_translations,    null: false,    default: {}

      t.string  :languages,                 null: false,    default: [], array: true

      t.timestamps
    end
  end
end
