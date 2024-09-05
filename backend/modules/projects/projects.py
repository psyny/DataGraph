from backend.modules.filemanager.filemanager import FileManager
from backend.modules.database.database import Database

# --------------------------------------------------------------
# Manages projects
# --------------------------------------------------------------    

# A project has a folder with its name in storage folder.
# The project folder has 4 files/folders:
# settings.json: project settings.
# models.json: project models.
# databases.json: project database metadata.
# databases: folder were the databases are saved.

# Database Metadata is a dict, where the key is its name and the fields are:
# name = <string> (database name)
# fileFormat = JSON | PDB  (the file format the database will save/load)
# flexLoad = True | False (if the file on its format not found during load, look for others on the same folder)
# modelName = <string> (model name of the entries of the database)
# indexField = <string> | None (entry field used for indexing)
# indexUnique = True | False (if index is unique per entry. changes the behavior of the database)

class Project:
    _projects = None # Projects currently in storage folder. Mapped by its name.

    _fileName_models = "models.json"
    _fileName_settings = "settings.json"
    _fileName_databaseMetadata = "databases.json"
    _folderName_databases = "databases"

    def __init__(self):
        self.name = ""
        self.models = []
        self.modelMap = {}
        self.settings = {}
        self.databasesMetadata = {}
        self.databases = {}
        self.loaded = False

    # Gets all project settings    
    def getProjects():
        if Project._projects == None:
            Project._projects = {}
            # Preloads all projects
            projectNames = FileManager.getFolders(["storage"])

            for projectName in projectNames:
                project = Project.preLoad(projectName)
                Project._projects[projectName] = project

        return Project._projects
    
    # Checks project storage integrity
    def _checkProjectIntegrity(projectName: str):
        mainProjectFolder = ["storage", projectName]
        databaseFolder = ["storage", projectName, Project._folderName_databases]

        # Check if project exists
        projectExists = FileManager.folderExists(mainProjectFolder)
        if not projectExists:
            return {
                "status": "project not found",
            }
        
        # Check if the database folder
        folderExists = FileManager.folderExists(databaseFolder)
        if not folderExists:
            return {
                "status": "database folder not found",
            }
        
        # Check project settings file
        fileExists = FileManager.fileExists(Project._fileName_settings, mainProjectFolder)
        if not fileExists:
            return {
                "status": "project settings not found",
                "errorInfo": Project._fileName_settings,
            }      

        # Check model definition file
        fileExists = FileManager.fileExists(Project._fileName_models, mainProjectFolder)
        if not fileExists:
            return {
                "status": "project model definitions not found",
                "errorInfo": Project._fileName_models,
            }           
        
        # Check database metadata file
        fileExists = FileManager.fileExists(Project._fileName_databaseMetadata, mainProjectFolder)
        if not fileExists:
            return {
                "status": "project database metadata not found",
                "errorInfo": Project._fileName_databaseMetadata,
            }  

        # Everything ok
        return {
            "status": "ok"
        }             

    # Loads only the settings of a project
    def preLoad(projectName: str):
        # Check project integrity
        integrity = Project._checkProjectIntegrity(projectName)
        if integrity["status"] != "ok":
            return integrity

        # Load project settings
        projectFolder = ["storage", projectName]
        settings = FileManager.loadJsonFile(Project._fileName_settings, projectFolder)

        # Create project object
        project = Project()
        project.name = projectName
        project.settings = settings

        return {
            "status": "ok",
            "project": project,
        }

    # Loads the entire project. Databases are always loaded on demand.
    def load(self):
        projectName = self.name
        projectFolder = ["storage", projectName]
        
        # load models
        self.models = FileManager.loadJsonFile(Project._fileName_models, projectFolder)
        for model in self.models:
            self.modelMap[model["name"]] = model

        # load database metadata    
        self.databasesMetadata = FileManager.loadJsonFile(Project._fileName_databaseMetadata, projectFolder)

        return {
            "status": "ok",
        }     

    # Saves the entire project
    def save(self):         
        # cannot save a project that is not loaded
        if self.loaded == False:
            return {
                "status": "error",
                "errorType": "Project is not loaded"
            }

        # Project file metadata
        projectName = self.name
        projectFolder = ["storage", projectName]
        databaseFolder = ["storage", projectName, Project._folderName_databases]

        # Create new project folder structure        
        FileManager.createFolders(projectFolder)
        FileManager.createFolders(databaseFolder)

        # Save files
        FileManager.saveJsonFile(self.settings, Project._fileName_settings, projectFolder)
        FileManager.saveJsonFile(self.models, Project._fileName_models, projectFolder)
        FileManager.saveJsonFile(self.databasesMetadata, Project._fileName_databaseMetadata, projectFolder)

        # Save databases
        databaseFolder = ["storage", projectName, Project._folderName_databases]
        for databaseMetadata in self.databasesMetadata.values():
            dbName = databaseMetadata["name"]
            database = self.databases.get(dbName)

            # If database was loaded and changed
            if database and database.changed == True:
                self.saveDatabase(dbName)

        return {
            "status": "ok",
        }                
                

    # Unloads a project back to the preloaded state
    def unload(self):
        self.models = []
        self.modelMap = {}
        self.databasesMetadata = {}
        self.databases = {}
        self.loaded = False

    # Creates a new project with default settings and saves it
    # Why this is not in the constructor? Because of loading and unloading
    def new(projectName: str, settings: dict = {}):
        # Check if a project with the same name exists
        integrity = Project._checkProjectIntegrity(projectName)
        if integrity["status"] != "project not found":
            return {
                "status": "error",
                "errorType": "project already exists",
                "errorInfo": projectName,
            }

        # Create a project
        project = Project()
        project.name = projectName

        # Default settings
        project.settings = {
        }

        # Overwrite given settings
        for key, value in settings.items():
            project.settings[key] = value

        # Save project
        project.loaded = True
        project.save()
        project.loaded = False

        # Add saved project to project settings
        projects = Project.getProjects()
        projects[project.name] = project

        return {
            "status": "ok",
            "project": project,
        }
    
    # --------------------------------------------------------------
    # Model functions
    # --------------------------------------------------------------  
    def getModel(self, modelName):
        pass

    def getModels(self):
        pass

    def newModel(self):
        pass

    # --------------------------------------------------------------
    # Database functions
    # --------------------------------------------------------------  

    # New Database
    def newDatabase(self, name, model, indexField = None, indexUnique = True, fileFormat = "PDB", flexLoad = True):
        # Checks if database exists
        currDatabase = self.databasesMetadata.get(name)
        if currDatabase != None:
            return {
                "status": "error",
                "errorType": "A databse with given name already exists",
                "errorInfo": name,
            }

        # Builds metadata
        databaseMetadata = {
            "name": name,
            "modelName": model.get("name"),
            "fileFormat": fileFormat,
            "flexLoad": flexLoad,
            "indexField": indexField,
            "indexField": indexUnique,
        }

        # Adds database
        self.databasesMetadata[name] = databaseMetadata


    # Get database
    def getDatabase(self, databaseName):
        # Gets the database metadata
        databaseMetadata = self.databasesMetadata.get(databaseName)
        if databaseMetadata == None:
            return {
                "status": "error",
                "errorType": "Database metadata not found",
                "errorInfo": databaseName,
            }

        # Gets the database object
        database = self.databases.get(databaseName)

        if database == None:
            loadInfo = self.loadDatabase(databaseName)

            if loadInfo["status"] != "ok":
                return loadInfo
            else:
                database = self.databases.get(databaseName)
            
        return database

    # Saves database to file system
    def saveDatabase(self, databaseName):
        # Gets the database metadata
        databaseMetadata = self.databasesMetadata.get(databaseName)
        if databaseMetadata == None:
            return {
                "status": "error",
                "errorType": "Database metadata not found",
                "errorInfo": databaseName,
            }

        # Gets the database object
        database = self.databases.get(databaseName)
        if database == None:
            return {
                "status": "error",
                "errorType": "Database data not found",
                "errorInfo": databaseName,
            }
        
        # Checks file format
        fileFormat = databaseMetadata.get("fileFormat")
        if fileFormat == None:
            return {
                "status": "error",
                "errorType": "File format not defined",
                "errorInfo": "",
            }
        elif fileFormat not in set(["JSON","PDB"]):
            return {
                "status": "error",
                "errorType": "File format not supported",
                "errorInfo": fileFormat,
            }

        # Save to file system
        fileContent = {
            "entries": database._entries,
            "indexMap": database._internalIndexMap,
        }

        databaseFolder = ["storage", self.name, Project._folderName_databases]
        if fileFormat == "JSON":
            FileManager.saveJsonFile(fileContent, databaseName + ".JSON", databaseFolder)
        elif fileFormat == "PDB":
            FileManager.savePickleFile(fileContent, databaseName + ".PDB", databaseFolder)

        return {
            "status": "ok",
        }
    
    # Loads database from file system
    def loadDatabase(self, databaseName):
        # Gets the database metadata
        databaseMetadata = self.databasesMetadata.get(databaseName)
        if databaseMetadata == None:
            return {
                "status": "error",
                "errorType": "Database metadata not found",
                "errorInfo": databaseName,
            }
        
        # Checks file format
        fileFormat = databaseMetadata.get("fileFormat")
        if fileFormat == None:
            return {
                "status": "error",
                "errorType": "File format not defined",
                "errorInfo": "",
            }
        elif fileFormat not in set(["JSON","PDB"]):
            return {
                "status": "error",
                "errorType": "File format not supported",
                "errorInfo": fileFormat,
            }

        # Loads from file system
        fileContent = None

        databaseFolder = ["storage", self.name, Project._folderName_databases]
        if fileFormat == "JSON":
            fileContent = FileManager.loadJsonFile(databaseName + ".JSON", databaseFolder)
        elif fileFormat == "PDB":
            fileContent = FileManager.loadPickleFile(databaseName + ".PDB", databaseFolder)

        if fileContent == None and databaseMetadata.get("flexLoad"):
            if fileFormat == "PDB":
                fileContent = FileManager.loadJsonFile(databaseName + ".JSON", databaseFolder)
            elif fileFormat == "JSON":
                fileContent = FileManager.loadPickleFile(databaseName + ".PDB", databaseFolder)

        if fileContent == None:
            return {
                "status": "error",
                "errorType": "Database file not found",
                "errorInfo": self.name,
            }            

        # Separates databse data and checks its integrity
        databaseEntries = fileContent.get("entries")
        if databaseEntries == None:
            return {
                "status": "error",
                "errorType": "Database entries not found on the file",
            }

        databaseIndexMap = fileContent.get("indexMap")
        if databaseIndexMap == None:
            return {
                "status": "error",
                "errorType": "Database index map not found on the file",
            }

        # Get model
        modelName = databaseMetadata.get("modelName")
        model = self.modelMap.get(modelName)
        if model == None:
            return {
                "status": "error",
                "errorType": "Model not found",
                "errorInfo": modelName
            }
        
        # Build new database object
        indexField = databaseMetadata.get("indexField")
        indexUnique = databaseMetadata.get("indexUnique")
        database = Database(databaseName, model, indexField, indexUnique)

        database._entries = databaseEntries
        database._internalIndexMap = databaseIndexMap

        self.databases[databaseName] = database

        return {
            "status": "ok",
            "database": database,
        }
