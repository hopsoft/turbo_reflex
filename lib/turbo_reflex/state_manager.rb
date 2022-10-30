# frozen_string_literal: true

require_relative "state"

# Class used to hold ephemeral state related to the rendered UI.
#
# Examples:
#
# - Sidebar open/closed state
# - Tree view open/closed state
# - Accordion collapsed/expanded state
# - Customized layout / presentation
# - Applied data filters
# - Number of data rows to display etc.
#
class TurboReflex::StateManager
  include ActiveModel::Dirty

  # For ActiveModel::Dirty tracking
  define_attribute_methods :state

  delegate :request, :response, to: :"runner.controller"
  attr_reader :client_state

  def initialize(runner)
    @runner = runner
    @state = TurboReflex::State.new(cookie) # server state as stored in the cookie

    # Merge client state into server state (i.e. optimistic state)
    # NOTE: Client state HTTP headers are only sent if/when state has changed on the client (only the changes are sent).
    #       This prevents race conditions (state mismatch) caused when frame and XHR requests emit immediately
    #       before the <meta id="turbo-reflex"> has been updated with the latest state from the server.
    @client_state = TurboReflex::State.deserialize_base64(header)
    @client_state.each { |key, value| self[key] = value }
  end

  delegate :cache_key, :payload, to: :state

  def [](*keys, default: nil)
    state.read(*keys, default: default)
  end

  def []=(*keys, value)
    state_will_change! if value != self[*keys]
    state.write(*keys, value)
  end

  def set_cookie
    return unless changed?
    state.shrink!
    state.prune!
    response.set_cookie "_turbo_reflex_state", value: state.ordinal_payload, path: "/", expires: 1.day.from_now
    changes_applied
  end

  private

  attr_reader :runner
  attr_reader :state

  def headers
    request.headers.select { |(key, _)| key.match?(/TURBOREFLEX_STATE/i) }.sort
  end

  # State that exists on the client.
  def header
    headers.map(&:last).join
  end

  # State that the server last rendered with.
  def cookie
    request.cookies["_turbo_reflex_state"]
  end
end
