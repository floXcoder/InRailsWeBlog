class HistorySerializer < ActiveModel::Serializer
  attributes :id,
             :changed_at,
             :article,
             :changeset

  def changed_at
    I18n.l(object.created_at, format: :custom).mb_chars.downcase.to_s
  end

  def article
    object.reify
  end
end
