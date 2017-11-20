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
    public class CustomerControllerTest
    {
        private CustomerController _CustomerController;

        private readonly IUnitOfWork _unitMocked;

        public CustomerControllerTest()
        {
            var unitMocked = new UnitOfWorkMoqData();
            _unitMocked = unitMocked.GetInstante();
            _CustomerController = new CustomerController(_unitMocked);
        }

        [Fact(DisplayName = "[CustomerController] Get List")]
        public void Get_All_Test()
        {
            var result = _CustomerController.GetAllList() as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = result.Value as List<Customer>;
            model.Count.Should().BeGreaterThan(0);
        }

        [Fact(DisplayName = "[CustomerController] Insert")]
        public void Insert_Customer_Test()
        {
            var customer = new Customer
            {
                CustomerId = 101,
                FirstName = "oscar",
                LastName = "Hernandez",
                Company = "CmacIca",
                Address = "Calle Libertad",
                City = "Ica",
                State = "Peru",
                Country = "Peru",
                PostalCode = "12227-000",
                Phone = "967888990",
                Fax = "3923-5566",
                Email = "oscar@embraer.com",
                SupportRepId = 3,
            };


            var result = _CustomerController.Post(customer) as ObjectResult;
            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = Convert.ToInt32(result.Value);
            model.Should().Be(101);

        }

        [Fact(DisplayName = "[CustomerController] Update")]
        public void Update_Customer_Test()
        {
            var currentCustomerprueba = _unitMocked.Customers.GetById(1);

            var customer = new Customer
            {
                CustomerId = 1,
                FirstName="Yuliana",
                LastName="Hernandez",
                Company="Serpico EIRL",
                Address="AV san Francisco",
                City="Ica",
                State="Peru",
                Country="Peru",
                PostalCode= "12227-000",
                Phone="967888990",
                Fax= "3923-5566",
                Email= "uliana@serpico.com",
                SupportRepId=2,
            };
            
            var result = _CustomerController.Put(customer) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = result.Value?.GetType().GetProperty("Message").GetValue(result.Value);
            model.Should().Be("The Customer is Updated");

            var currentCustomer = _unitMocked.Customers.GetById(1);
            currentCustomer.Should().NotBeNull();
            currentCustomer.CustomerId.Should().Be(customer.CustomerId);
           
        }

        [Fact(DisplayName = "[CustomerController] Delete")]
        public void Delete_Customer_Test()
        {
            var Customer = 1;

            var result = _CustomerController.Delete(Customer) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = Convert.ToBoolean(result.Value);
            model.Should().BeTrue();

            var currentCustomer = _unitMocked.Customers.GetById(1);
            currentCustomer.Should().BeNull();
        }

        [Fact(DisplayName = "[CustomerController] Get By Id")]
        public void GetById_Customer_Test()
        {
            var result = _CustomerController.GetById(1) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = result.Value as Customer;
            model.Should().NotBeNull();
            model.CustomerId.Should().BeGreaterThan(0);
        }
    }
}
