require_relative '../../spec_helper'
require_relative 'fixtures/strings'
require_relative 'shared/each_document'

require 'yaml'

describe "YAML.load_stream" do
  it_behaves_like :yaml_each_document, :load_stream
end
