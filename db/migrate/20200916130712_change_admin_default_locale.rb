class ChangeAdminDefaultLocale < ActiveRecord::Migration[6.0]
  def change
    change_column_default(:admins, :locale, from: 'fr', to: 'en')
  end
end
