from backend.modules.projects.projects import Project

class ContextManager:
    singleton = None

    def __init__(self):
        self.openedProject: Project = None
        return

    def init(self):
        return

    def openProject(self, projectName: str):
        if self.openedProject != None:            
            opData = self.closeProject()
            if opData["status"] != "ok":
                return opData            
            
        projects = Project.getProjects()
        project: Project = projects.get(projectName)

        if project == None:
            return {
                "status": "error",
                "errorType": "Project not found",
                "errorInfo": projectName,
            }
        
        project.load()
        self.openedProject = project
        
    def closeProject(self):
        opData = self.openedProject.save()  
        if opData["status"] != "ok":
            return opData     

        self.openedProject.unload()     
        self.openedProject = None

        return {
            "status": "ok",
        }



def getContextManager():
    if ContextManager.singleton == None:
        ContextManager.singleton = ContextManager()

    return ContextManager.singleton


