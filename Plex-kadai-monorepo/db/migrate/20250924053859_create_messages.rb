class CreateMessages < ActiveRecord::Migration[7.1]
  def change
    create_table :messages do |t|
      t.references :message_thread, null: false, foreign_key: true
      t.references :sender, null: false, foreign_key: { to_table: :users }  # ここがポイント
      t.text :body, null: false

      t.timestamps
    end
  end
end
