class CreateJobPosts < ActiveRecord::Migration[7.1]
  def change
    create_table :job_posts do |t|
      t.references :company, null: false, foreign_key: { to_table: :users }  # ← ここを修正
      t.string :title, null: false
      t.text :description, null: false
      t.text :tags
      t.timestamps
    end
  end
end
