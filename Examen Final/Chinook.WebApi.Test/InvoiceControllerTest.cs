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
    public class InvoiceControllerTest
    {
        private InvoiceController _InvoiceController;

        private readonly IUnitOfWork _unitMocked;

        public InvoiceControllerTest()
        {
            var unitMocked = new UnitOfWorkMoqData();
            _unitMocked = unitMocked.GetInstante();
            _InvoiceController = new InvoiceController(_unitMocked);
        }

        [Fact(DisplayName = "[InvoiceController] Get List")]
        public void Get_All_Test()
        {
            var result = _InvoiceController.GetAllList() as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = result.Value as List<Invoice>;
            model.Count.Should().BeGreaterThan(0);
        }

        [Fact(DisplayName = "[InvoiceController] Insert")]
        public void Insert_Invoice_Test()
        {
            var invoice = new Invoice
            {
                InvoiceId = 101,
                CustomerId=2,
                InvoiceDate=Convert.ToDateTime("2009/1/1"),
                BillingAddress= "Theodor-Heuss 34",
                BillingCity= "Stuttgart",
                BillingCountry= "Germany",
                BillingPostalCode= "70174",
                Total=5               
            };

           
            var result = _InvoiceController.Post(invoice) as ObjectResult;
            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = Convert.ToInt32(result.Value);
            model.Should().Be(101);

        }

        [Fact(DisplayName = "[InvoiceController] Update")]
        public void Update_Invoice_Test()
        {
            var currentInvoiceprueba = _unitMocked.Invoices.GetById(1);

            var invoice = new Invoice
            {
                InvoiceId = 1,
                CustomerId = 2,
                InvoiceDate = Convert.ToDateTime("2010/1/1"),
                BillingAddress = "Tupac Amaru",
                BillingCity = "Ica",
                BillingCountry = "Peru",
                BillingPostalCode = "67785",
                Total = 4
            };

            var result = _InvoiceController.Put(invoice) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = result.Value?.GetType().GetProperty("Message").GetValue(result.Value);
            model.Should().Be("The Invoice is Updated");

            var currentInvoice = _unitMocked.Invoices.GetById(1);
            currentInvoice.Should().NotBeNull();
            currentInvoice.InvoiceId.Should().Be(invoice.InvoiceId);

        }

        [Fact(DisplayName = "[InvoiceController] Delete")]
        public void Delete_Invoice_Test()
        {
            var invoice = 1;

            var result = _InvoiceController.Delete(invoice) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = Convert.ToBoolean(result.Value);
            model.Should().BeTrue();

            var currentInvoice = _unitMocked.Invoices.GetById(1);
            currentInvoice.Should().BeNull();
        }

        [Fact(DisplayName = "[InvoiceController] Get By Id")]
        public void GetById_Invoice_Test()
        {
            var result = _InvoiceController.GetById(1) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = result.Value as Invoice;
            model.Should().NotBeNull();
            model.InvoiceId.Should().BeGreaterThan(0);
        }
    }
}
