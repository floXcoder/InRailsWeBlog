class ChangeUserDefaultLocale < ActiveRecord::Migration[6.0]
  def change
    change_column_default(:users, :locale, from: 'fr', to: 'en')
  end
end
