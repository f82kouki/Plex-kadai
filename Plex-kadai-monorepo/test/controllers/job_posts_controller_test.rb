require "test_helper"

class JobPostsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get job_posts_index_url
    assert_response :success
  end

  test "should get show" do
    get job_posts_show_url
    assert_response :success
  end

  test "should get create" do
    get job_posts_create_url
    assert_response :success
  end
end
