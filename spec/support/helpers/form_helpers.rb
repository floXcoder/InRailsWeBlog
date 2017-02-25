module Features
  module FormHelpers
    # js must be enabled
    def fill_in_wysihtml5(id, text)
      page.execute_script("$('##{id}').data('wysihtml5').editor.setValue('#{text}');")
      page.execute_script("$('##{id}').val('#{text}');")
    end

    def fill_in_tagsinput(id, tag)
      page.execute_script("$('##{id}').tagsinput('add', '#{tag}');")
    end
  end
end
