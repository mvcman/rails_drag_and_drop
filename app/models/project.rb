class Project < ApplicationRecord
    acts_as_list

    # broadcasts_to ->(project) { "projects" }

    after_create_commit -> { broadcast_append_to "projects" }
    # after_update_commit :broadcast_project_update
    after_destroy_commit -> { broadcast_remove_to "projects" }
    after_update_commit :broadcast_project_update

    private
  
    def broadcast_project_update
      # Only broadcast the whole list if the position has changed
      if saved_change_to_attribute?(:position)
        broadcast_replace_to "projects", target: "projects", partial: "projects/projects", locals: { projects: Project.order(:position) }
      else 
        broadcast_replace_to "projects"
      end
    end
end
