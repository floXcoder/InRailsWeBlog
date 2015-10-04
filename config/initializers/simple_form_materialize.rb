# Use this setup block to configure all options available in SimpleForm.
SimpleForm.setup do |config|
  config.error_notification_class = 'form-error'
  # config.button_class = 'waves-effect waves-light btn'
  config.boolean_label_class = nil

  config.wrappers :materialize_input, tag: 'div', class: 'input-field', error_class: 'has-error' do |b|
    b.use :html5
    b.use :placeholder
    b.optional :maxlength
    b.optional :pattern
    b.optional :min_max
    b.optional :readonly

    b.use :icon
    b.use :input, class: 'validate'
    b.use :label
    b.use :error, wrap_with: { tag: 'span', class: 'field-error' }
    b.use :hint,  wrap_with: { tag: 'span', class: 'help-block' }
  end

  config.wrappers :materialize_checkbox, tag: 'p', error_class: 'has-error' do |b|
    b.use :html5
    b.optional :readonly

    b.use :input, type: 'checkbox', class: 'filled-in'
    b.use :label
    b.use :error, :wrap_with => { :tag => 'span', :class => 'help-inline' }
    b.use :hint,  :wrap_with => { :tag => 'p', :class => 'help-block' }
  end

  config.wrappers :materialize_select, tag: 'div', class: 'input-field', error_class: 'has-error' do |b|
    b.use :html5
    b.optional :readonly

    b.use :input
    b.use :label
    b.use :error, :wrap_with => { :tag => 'span', :class => 'help-inline' }
    b.use :hint,  :wrap_with => { :tag => 'p', :class => 'help-block' }
  end

  config.wrappers :materialize_textarea, tag: 'div', class: 'input-field', error_class: 'has-error' do |b|
    b.use :html5
    b.use :placeholder
    b.optional :maxlength
    b.optional :pattern
    b.optional :min_max
    b.optional :readonly

    b.use :input, class: 'materialize-textarea'
    b.use :label
    b.use :error, :wrap_with => { :tag => 'span', :class => 'help-inline' }
    b.use :hint,  :wrap_with => { :tag => 'p', :class => 'help-block' }
  end

  # config.wrappers :materialize_boolean, tag: 'p', error_class: 'has-error' do |b|
  #   b.use :html5
  #   b.optional :readonly
  #
  #   b.use :input
  #   b.use :label
  #   b.use :error, wrap_with: { tag: 'span', class: 'error-block' }
  #   b.use :hint,  wrap_with: { tag: 'span', class: 'help-block' }
  # end
  #
  # config.wrappers :materialize_radio_and_checkboxes, tag: 'p', error_class: 'has-error' do |b|
  #   b.use :html5
  #   b.optional :readonly
  #   b.use :input
  #   b.use :label
  #   b.use :error, wrap_with: { tag: 'span', class: 'error-block' }
  #   b.use :hint,  wrap_with: { tag: 'span', class: 'help-block' }
  # end
  #
  # config.wrappers :materialize_file_input, tag: 'div', class: 'form-group', error_class: 'has-error' do |b|
  #   b.use :html5
  #   b.use :placeholder
  #   b.optional :maxlength
  #   b.optional :readonly
  #   b.use :label, class: 'control-label'
  #
  #   b.use :input
  #   b.use :error, wrap_with: { tag: 'span', class: 'help-block' }
  #   b.use :hint,  wrap_with: { tag: 'p', class: 'help-block' }
  # end

  config.default_wrapper = :materialize_input
  config.wrapper_mappings = {
      # check_boxes: :materialize_checkboxes,
      # radio_buttons: :materialize_radio_and_checkboxes,
      # file: :materialize_file_input,
      # boolean: :materialize_boolean,
  }
end

module SimpleForm
  module Components
    module Icons
      def icon(wrapper_options)
        template.content_tag(:i, options[:icon], class: 'material-icons prefix') unless options[:icon].nil?
      end
    end
  end
end

SimpleForm::Inputs::Base.send(:include, SimpleForm::Components::Icons)
