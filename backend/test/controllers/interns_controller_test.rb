require "test_helper"

class InternsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get interns_index_url
    assert_response :success
  end

  test "should get show" do
    get interns_show_url
    assert_response :success
  end
end
