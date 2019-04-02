var project = require('../../models/Project');
var assert = require('assert');

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

    async check_program(employee)
    {
        if (this.project.program != null)
        {
            var query = project.find({"_id": {$ne:this.project._id},program:this.project.program})
                .populate('productOwner scrumMaster developmentTeam');

            assert.ok(!(query instanceof Promise));
            var promise = query.exec();
            assert.ok(promise instanceof Promise);

            promise.then((projects) =>
                {
                    //console.log(projects);
                    for (var prj of projects)
                    {
                        var employees = [];
                        employees.push(prj.productOwner.id);
                        employees.push(prj.scrumMaster.id);
                        for (var member of prj.developmentTeam)
                        {
                            employees.push(member.id);
                        }

                        if (employees.includes(employee))
                        {
                            this.scores.forEach( (pairs) =>
                            {
                                if (pairs[0] === employee)
                                {
                                    pairs[1] += 1;
                                }
                            });
                        }
                    }
                    console.log(this.scores);
                })
                .catch((error) =>
                {
                   console.log(error);
                });
        }
    }

    generate_suggestions()
    {
        this.fill_hashTable();

        this.scores.forEach( (pairs) =>
        {
            this.compare_skills(pairs[0]);
        });

        this.scores.forEach( (pairs) =>
        {
            this.check_program(pairs[0]);
        });

        return this.scores;
    }
}

module.exports = Technical_Recommandations;