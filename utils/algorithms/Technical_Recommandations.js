var project = require('../../models/Project');
var async = require("async");

class Technical_Recommandations
{
    constructor(employees, projects, project)
    {
        this.scores = [];
        this.project = project;
        this.employees = employees;
        this.projects = projects;
    }

    check_availability(employee, projects)
    {
        var busy_employees = [];

        for (var project of projects)
        {
            busy_employees.push(project.productOwner.id);
            busy_employees.push(project.scrumMaster.id);
            for (var member of project.developmentTeam)
            {
                busy_employees.push(member.id);
            }
        }

        var b = true;

        for (var id of busy_employees)
        {
            if (id === employee.id)
            {
                b = false;
            }
        }

        return b;
    }

    fill_hashTable()
    {
        for (var employee of this.employees)
        {
            if (this.check_availability(employee, this.projects))
            {
                this.scores.push([employee.id, 0]);
            }
        }
    }

    compare_skills(employee)
    {
        var skills = [];

        for (var skill of this.project.skills)
        {
            skills.push(skill.id);
        }

        var empl = this.employees.filter((e) =>
        {
           return e.id === employee;
        })[0];

        for (var skl of empl.skills)
        {
            if (skills.includes(skl.skill.id))
            {
                this.scores.forEach( (pairs) =>
                {
                    if (pairs[0] === employee)
                    {
                        pairs[1] += skl.years;
                    }
                });
            }
        }
    }

    check_skills()
    {
        this.fill_hashTable();
        this.scores.forEach( (pairs) =>
        {
            this.compare_skills(pairs[0]);
        });
        return this.scores;
    }

    check_program(projects, scores)
    {
        scores.forEach( (pairs) =>
        {
            for (var prj of projects)
            {
                var employees = [];
                employees.push(prj.productOwner.id);
                employees.push(prj.scrumMaster.id);
                for (var member of prj.developmentTeam)
                {
                    employees.push(member.id);
                }

                if (employees.includes(pairs[0]))
                {
                    var c = 0;
                    for (var i = 0; i < employees.length; i++)
                    {
                        if (employees[i] == pairs[0])
                        {
                            c++;
                        }
                    }
                    pairs[1] += c;
                }
            }
        });

        return scores;
    }

    check_entreprise(projects, scores)
    {
        scores.forEach((pairs) =>
        {
            for (var prj of projects)
            {
                var employees = [];
                employees.push(prj.productOwner.id);
                employees.push(prj.scrumMaster.id);
                for (var member of prj.developmentTeam)
                {
                    employees.push(member.id);
                }

                if (employees.includes(pairs[0]))
                {
                    var c = 0;
                    for (var i = 0; i < employees.length; i++)
                    {
                        if (employees[i] == pairs[0])
                        {
                            c++;
                        }
                    }
                    pairs[1] += c;
                }
            }
        });

        return scores;
    }

    check_field(projects, scores)
    {
        scores.forEach((pairs) =>
        {
            for (var prj of projects)
            {
                var employees = [];
                employees.push(prj.productOwner.id);
                employees.push(prj.scrumMaster.id);
                for (var member of prj.developmentTeam)
                {
                    employees.push(member.id);
                }

                if (employees.includes(pairs[0]))
                {
                    var c = 0;
                    for (var i = 0; i < employees.length; i++)
                    {
                        if (employees[i] == pairs[0])
                        {
                            c++;
                        }
                    }
                    pairs[1] += c*2;
                }
            }
        });

        return scores;
    }

    generate_suggestions(scores)
    {
        scores.forEach((pairs) =>
        {
            this.employees.forEach((employee) =>
            {
                if (pairs[0] === employee.id)
                {
                    pairs[0] = employee;
                }
            });
        });

        scores.sort(function(a, b)
        {
            return (a[1] < b[1]) ? 1 : ((b[1] < a[1]) ? -1 : 0)
        });

        return scores;
    }
}

module.exports = Technical_Recommandations;