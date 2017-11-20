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
    public class TrackControllerTest
    {
        private TrackController _TrackController;

        private readonly IUnitOfWork _unitMocked;

        public TrackControllerTest()
        {
            var unitMocked = new UnitOfWorkMoqData();
            _unitMocked = unitMocked.GetInstante();
            _TrackController = new TrackController(_unitMocked);
        }

        [Fact(DisplayName = "[TrackController] Get List")]
        public void Get_All_Test()
        {
            var result = _TrackController.GetAllList() as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = result.Value as List<Track>;
            model.Count.Should().BeGreaterThan(0);
        }

        [Fact(DisplayName = "[TrackController] Insert")]
        public void Insert_Invoice_Test()
        {
            var track = new Track
            {
                TrackId = 101,
                Name= "Princess of the Dawn",
                AlbumId=2,
                MediaTypeId=2,
                GenreId=2,
                Composer= "Deaffy & R.A.Smith - Diesel",
                Milliseconds= 375418,
                Bytes= 6290521,
                UnitPrice=3

            };

            var result = _TrackController.Post(track) as ObjectResult;
            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = Convert.ToInt32(result.Value);
            model.Should().Be(101);

        }

        [Fact(DisplayName = "[TrackController] Update")]
        public void Update_Invoice_Test()
        {
            var currentInvoiceprueba = _unitMocked.Tracks.GetById(5);

            var track = new Track
            {
                TrackId = 5,
                Name = "Put The Finger On You",
                AlbumId = 3,
                MediaTypeId = 3,
                GenreId = 2,
                Composer = "Angus Young, Malcolm Young, Brian Johnson",
                Milliseconds = 205662,
                Bytes = 6713451,
                UnitPrice = 2

            };

            var result = _TrackController.Put(track) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = result.Value?.GetType().GetProperty("Message").GetValue(result.Value);
            model.Should().Be("The Track is Updated");

            var currentInvoice = _unitMocked.Tracks.GetById(5);
            currentInvoice.Should().NotBeNull();
            currentInvoice.TrackId.Should().Be(track.TrackId);

        }

        [Fact(DisplayName = "[TrackController] Delete")]
        public void Delete_Invoice_Test()
        {
            var track = 5;

            var result = _TrackController.Delete(track) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = Convert.ToBoolean(result.Value);
            model.Should().BeTrue();

            var currentInvoice = _unitMocked.Tracks.GetById(5);
            currentInvoice.Should().BeNull();
        }

        [Fact(DisplayName = "[TrackController] Get By Id")]
        public void GetById_Invoice_Test()
        {
            var result = _TrackController.GetById(5) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = result.Value as Track;
            model.Should().NotBeNull();
            model.TrackId.Should().BeGreaterThan(0);
        }
    }
}
