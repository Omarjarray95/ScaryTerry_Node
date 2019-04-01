var user = require('../models/User');

class Technical_Recommandations
{
    constructor(employees, projects, project)
    {
        this.scores = [];
        this.project = project;
        this.employees = employees;
        this.projects = projects;
    }

    generate_suggestions()
    {
        for (var employee of this.employees)
        {
            this.scores.push([employee._id, 0]);
        }

        return this.projects;
    }
}

module.exports = Technical_Recommandations;