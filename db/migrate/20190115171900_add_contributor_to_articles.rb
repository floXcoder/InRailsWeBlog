class AddContributorToArticles < ActiveRecord::Migration[5.2]
  def change
    add_reference :articles, :contributor
  end
end
