# frozen_string_literal: true

module VisitHelper
  def format_tracking(data, limit_for_others = 12)
    formatted_data = data.map { |key, val| { key => val.count } }.reduce({}, :merge).sort_by { |_k, v| -v }

    unless formatted_data.empty? || (formatted_data.size == 1 && formatted_data[0][0].nil?)
      internal_indexes = formatted_data.each_index.select { |i| formatted_data[i][0]&.downcase&.include?(ENV['WEBSITE_HOST'].sub('www.', '')) }
      if internal_indexes.present?
        internal_data    = ['internal', 0]
        internal_data[1] = internal_indexes.reduce(0) { |sr, i| sr + formatted_data[i][1] }
        internal_indexes.each_with_index { |index, i| formatted_data.delete_at(index - i) }
        formatted_data << internal_data
      end

      if formatted_data.size > limit_for_others
        others_count   = formatted_data[limit_for_others + 1..].reduce(0) { |sr, count| sr + count[1] }
        formatted_data = formatted_data[0..limit_for_others]
        formatted_data << ['others', others_count]
      end

      nil_indexes = formatted_data.each_index.select { |i| formatted_data[i][0].blank? }
      if nil_indexes.present?
        nil_data    = [nil, 0]
        nil_data[1] = nil_indexes.reduce(0) { |sr, i| sr + formatted_data[i][1] }
        nil_indexes.each_with_index { |index, i| formatted_data.delete_at(index - i) }
        formatted_data << nil_data
      end

      formatted_data = formatted_data.to_h
    end

    return formatted_data
  end
end
