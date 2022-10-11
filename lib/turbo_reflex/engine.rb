# frozen_string_literal: true

require "turbo-rails"
require_relative "version"
require_relative "sanitizer"
require_relative "runner"
require_relative "base"

class TurboReflex::Engine < ::Rails::Engine
  config.turbo_reflex = ActiveSupport::OrderedOptions.new
  initializer "turbo_reflex.configuration" do
    Mime::Type.register "text/vnd.turbo-reflex.html", :turbo_reflex

    config.to_prepare do |app|
      ::ActionController::Base.send :include, TurboReflex::Controller
    end
  end
end
