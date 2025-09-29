class CreateMessageThreadParticipants < ActiveRecord::Migration[8.0]
  def change
    create_table :message_thread_participants do |t|
      t.references :message_thread, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
