class DragController < ApplicationController
    def project
        @project = Project.find(dragProjectParams[:id])
        @project.insert_at(dragProjectParams[:position].to_i + 1)
        # projects = Project.order(:position)
        # respond_to do |format|
        #     format.turbo_stream do 
        #         render turbo_stream: [
        #           turbo_stream.replace("projects", partial: "projects/projects", locals: { projects: projects })
        #         ]
        #     end
        # end
    end 

    private 
    def dragProjectParams
        params.require(:resource).permit(:id, :position)
    end 
end
