using Chinook.ModData;
using Chinook.Models;
using Chinook.UnitOfWork;
using Chinook.WebApi.Controllers;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using Xunit;

namespace Chinook.WebApi.Test
{
    public class EmployeeControllerTest
    {
        private EmployeeController _EmployeeController;

        private readonly IUnitOfWork _unitMocked;

        public EmployeeControllerTest()
        {
            var unitMocked = new UnitOfWorkMoqData();
            _unitMocked = unitMocked.GetInstante();
            _EmployeeController = new EmployeeController(_unitMocked);
        }

        [Fact(DisplayName = "[EmployeeController] Get List")]
        public void Get_All_Test()
        {
            var result = _EmployeeController.GetAllList() as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = result.Value as List<Employee>;
            model.Count.Should().BeGreaterThan(0);
        }

        [Fact(DisplayName = "[EmployeeController] Insert")]
        public void Insert_Employee_Test()
        {
            var employee = new Employee
            {
                EmployeeId = 101,
                LastName="Marcos",
                FirstName="Uchuya",
                Title= "IT Staff",
                ReportsTo=6,
                BirthDate= Convert.ToDateTime("1989/01/09"),
                HireDate= Convert.ToDateTime("2004/03/04"),
                Address= "Calle tupac Amaru",
                City="Ica",
                State="Peru",
                Country="Peru",
                PostalCode="+051",
                Phone="965123456",
                Fax= "(403) 467-8772",
                Email="marcos@hotmail.com"

            };


            var result = _EmployeeController.Post(employee) as ObjectResult;
            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = Convert.ToInt32(result.Value);
            model.Should().Be(101);

        }

        [Fact(DisplayName = "[EmployeeController] Update")]
        public void Update_Employee_Test()
        {
            var currentEmployeeprueba = _unitMocked.Employees.GetById(1);

            var employee = new Employee
            {
                EmployeeId = 1,
                LastName = "Julio",
                FirstName = "Lizarzaburu",
                Title = "IT Manager",
                ReportsTo = 6,
                BirthDate = Convert.ToDateTime("1990/01/09"),
                HireDate = Convert.ToDateTime("2005/03/04"),
                Address = "Calle libertad",
                City = "Ica",
                State = "Peru",
                Country = "Peru",
                PostalCode = "+051",
                Phone = "965987654",
                Fax = "(403) 467-8772",
                Email = "julio@hotmail.com"

            };

            var result = _EmployeeController.Put(employee) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = result.Value?.GetType().GetProperty("Message").GetValue(result.Value);
            model.Should().Be("The Employee is Updated");

            var currentEmployee = _unitMocked.Employees.GetById(1);
            currentEmployee.Should().NotBeNull();
            currentEmployee.EmployeeId.Should().Be(employee.EmployeeId);

        }

        [Fact(DisplayName = "[EmployeeController] Delete")]
        public void Delete_Employee_Test()
        {
            var Employee = 1;

            var result = _EmployeeController.Delete(Employee) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = Convert.ToBoolean(result.Value);
            model.Should().BeTrue();

            var currentEmployee = _unitMocked.Employees.GetById(1);
            currentEmployee.Should().BeNull();
        }

        [Fact(DisplayName = "[EmployeeController] Get By Id")]
        public void GetById_Employee_Test()
        {
            var result = _EmployeeController.GetById(1) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = result.Value as Employee;
            model.Should().NotBeNull();
            model.EmployeeId.Should().BeGreaterThan(0);
        }
    }
}
