class TranslateSlugToArticles < ActiveRecord::Migration[6.0]
  def change
    remove_index :articles, :slug
    remove_column :articles, :slug, :string

    add_column :articles, :slug, :jsonb

    add_index :articles, "(slug->'fr')", name: "index_articles_on_slug_fr"
    add_index :articles, "(slug->'en')", name: "index_articles_on_slug_en"
    add_index :articles, "(slug->'de')", name: "index_articles_on_slug_de"
    add_index :articles, "(slug->'it')", name: "index_articles_on_slug_it"
    add_index :articles, "(slug->'es')", name: "index_articles_on_slug_es"
  end
end
