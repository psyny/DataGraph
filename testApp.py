from backend.modules.projects.projects import Project


newProject = Project.new("barack")
projects = Project.getProjects()
print(projects)


from backend.modules.database.database import Database

print("NO INDEX TESTS")
dataBase = Database("TestDB", "")

entry = {
    "name": "Psyny",
    "age": 35,
    }
dataBase.add(entry)
entry = dataBase.getByInternalIndex(entry["iid"])
print(entry)

entry = dataBase.getByInternalIndex(999)
print(entry)



print("INDEX TESTS")
dataBase = Database("TestDB", "", "name")

entry = {
    "name": "Psyny",
    "age": 35,
    "sex": "m",
    }
dataBase.add(entry)
entry = dataBase.get("Psyny")
print(entry)

entry = {
    "name": "Psynya",
    "age": 45,
    "sex": "m",
    "iid": 0,
    }
entry = dataBase.set(entry)
print(entry)

entry = dataBase.get("Psyny")
print(entry)
