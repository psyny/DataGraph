class Models:
    def __init__(self):
        self.projectName = ""
        self.models = dict()

    def loadFromJson(self, json):
        pass 

    def __buildModelsDB():
        pass

    def addModel(self, modelObj):
        self.models[modelObj["name"]] = modelObj

    def getModel(self, modelName):
        return self.models.get(modelName)

    def removeModel(self, modelName):
        if getModel(modelName):
            del self.models[modelName]
            return True
        else:
            return False
        

class ModelLoader:
    def loadModelsFromProject(projectName):
        modelJson # Load File as JSON
        modelObj # Convert JSON to Python Object

        models = Models()        
        
        for model in modelObj:
            models.addModel(model)

        return models

    def saveModelsToProject(models, projectName):
        return

    
