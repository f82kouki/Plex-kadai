class CreateProfiles < ActiveRecord::Migration[8.0]
  def change
    create_table :profiles do |t|
      t.references :user, null: false, foreign_key: true
      t.string :name
      t.string :school
      t.text :bio
      t.text :links
      t.jsonb :skills

      t.timestamps
    end
  end
end
