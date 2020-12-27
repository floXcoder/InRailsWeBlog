class CreateArticleRedirections < ActiveRecord::Migration[6.1]
  def change
    create_table :article_redirections do |t|
      t.belongs_to  :article,         null: false,  index: false

      t.string      :previous_slug,   null: false
      t.string      :current_slug,    null: false

      t.string      :locale

      t.timestamps
    end

    add_index :article_redirections, :article_id
  end
end
