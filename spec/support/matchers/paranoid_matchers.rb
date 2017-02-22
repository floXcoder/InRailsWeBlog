RSpec::Matchers.define :act_as_paranoid do |model|
  match do |actual|
    expect(actual).to have_db_column(:deleted_at)
    # expect(actual).to have_db_index(:deleted_at)

    expect(model.all.where_sql).to include('"deleted_at" IS NULL')
    expect(model.unscoped.where_sql.to_s).to eq('')
  end

  description do
    'model acts as paranoid'
  end

  failure_message do |model_name|
    "#{model_name} expected to have paranoid attributes"
  end

  failure_message_when_negated do |model_name|
    "#{model_name} expected not to have paranoid attributes"
  end
end
