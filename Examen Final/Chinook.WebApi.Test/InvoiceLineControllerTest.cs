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
    public class InvoiceLineControllerTest
    {
        private InvoiceLineController _InvoiceLineController;

        private readonly IUnitOfWork _unitMocked;

        public InvoiceLineControllerTest()
        {
            var unitMocked = new UnitOfWorkMoqData();
            _unitMocked = unitMocked.GetInstante();
            _InvoiceLineController = new InvoiceLineController(_unitMocked);
        }

        [Fact(DisplayName = "[InvoiceLineController] Get List")]
        public void Get_All_Test()
        {
            var result = _InvoiceLineController.GetAllList() as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = result.Value as List<InvoiceLine>;
            model.Count.Should().BeGreaterThan(0);
        }

        [Fact(DisplayName = "[InvoiceLineController] Insert")]
        public void Insert_Invoice_Test()
        {
            var invoiceLine = new InvoiceLine
            {
                InvoiceLineId = 101,
                InvoiceId=2,
                TrackId=2,
                UnitPrice=3,
                Quantity=7,
            };

            var result = _InvoiceLineController.Post(invoiceLine) as ObjectResult;
            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = Convert.ToInt32(result.Value);
            model.Should().Be(101);

        }

        [Fact(DisplayName = "[InvoiceLineController] Update")]
        public void Update_Invoice_Test()
        {
            var currentInvoiceprueba = _unitMocked.InvoiceLines.GetById(5);

            var invoiceLine = new InvoiceLine
            {
                InvoiceLineId = 5,
                InvoiceId = 3,
                TrackId = 3,
                UnitPrice = 2,
                Quantity = 6,
            };

            var result = _InvoiceLineController.Put(invoiceLine) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = result.Value?.GetType().GetProperty("Message").GetValue(result.Value);
            model.Should().Be("The InvoiceLine is Updated");

            var currentInvoice = _unitMocked.InvoiceLines.GetById(5);
            currentInvoice.Should().NotBeNull();
            currentInvoice.InvoiceId.Should().Be(invoiceLine.InvoiceId);

        }

        [Fact(DisplayName = "[InvoiceLineController] Delete")]
        public void Delete_Invoice_Test()
        {
            var invoiceLine = 5;

            var result = _InvoiceLineController.Delete(invoiceLine) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = Convert.ToBoolean(result.Value);
            model.Should().BeTrue();

            var currentInvoice = _unitMocked.InvoiceLines.GetById(5);
            currentInvoice.Should().BeNull();
        }

        [Fact(DisplayName = "[InvoiceLineController] Get By Id")]
        public void GetById_Invoice_Test()
        {
            var result = _InvoiceLineController.GetById(5) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = result.Value as InvoiceLine;
            model.Should().NotBeNull();
            model.InvoiceLineId.Should().BeGreaterThan(0);
        }
    }
}
