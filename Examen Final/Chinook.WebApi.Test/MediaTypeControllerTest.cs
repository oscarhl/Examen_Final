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
    public class MediaTypeControllerTest
    {
        private MediaTypeController _MediaTypeController;

        private readonly IUnitOfWork _unitMocked;

        public MediaTypeControllerTest()
        {
            var unitMocked = new UnitOfWorkMoqData();
            _unitMocked = unitMocked.GetInstante();
            _MediaTypeController = new MediaTypeController(_unitMocked);
        }

        [Fact(DisplayName = "[MediaTypeController] Get List")]
        public void Get_All_Test()
        {
            var result = _MediaTypeController.GetAllList() as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = result.Value as List<MediaType>;
            model.Count.Should().BeGreaterThan(0);
        }

        [Fact(DisplayName = "[MediaTypeController] Insert")]
        public void Insert_Invoice_Test()
        {
            var mediaType = new MediaType
            {
                MediaTypeId = 101,
                Name= "Protected MPEG-4 video file"

            };

            var result = _MediaTypeController.Post(mediaType) as ObjectResult;
            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = Convert.ToInt32(result.Value);
            model.Should().Be(101);

        }

        [Fact(DisplayName = "[MediaTypeController] Update")]
        public void Update_Invoice_Test()
        {
            var currentInvoiceprueba = _unitMocked.MediaTypes.GetById(5);

            var mediaType = new MediaType
            {
                MediaTypeId = 5,
                Name = "Purchased AAC audio file"

            };

            var result = _MediaTypeController.Put(mediaType) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = result.Value?.GetType().GetProperty("Message").GetValue(result.Value);
            model.Should().Be("The MediaType is Updated");

            var currentInvoice = _unitMocked.MediaTypes.GetById(5);
            currentInvoice.Should().NotBeNull();
            currentInvoice.MediaTypeId.Should().Be(mediaType.MediaTypeId);

        }

        [Fact(DisplayName = "[MediaTypeController] Delete")]
        public void Delete_Invoice_Test()
        {
            var mediaType = 5;

            var result = _MediaTypeController.Delete(mediaType) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = Convert.ToBoolean(result.Value);
            model.Should().BeTrue();

            var currentInvoice = _unitMocked.MediaTypes.GetById(5);
            currentInvoice.Should().BeNull();
        }

        [Fact(DisplayName = "[MediaTypeController] Get By Id")]
        public void GetById_Invoice_Test()
        {
            var result = _MediaTypeController.GetById(5) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = result.Value as MediaType;
            model.Should().NotBeNull();
            model.MediaTypeId.Should().BeGreaterThan(0);
        }
    }
}
