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
    public class PlaylistTrackControllerTest
    {
        private PlaylistTrackController _PlaylistTrackController;

        private readonly IUnitOfWork _unitMocked;

        public PlaylistTrackControllerTest()
        {
            var unitMocked = new UnitOfWorkMoqData();
            _unitMocked = unitMocked.GetInstante();
            _PlaylistTrackController = new PlaylistTrackController(_unitMocked);
        }

        [Fact(DisplayName = "[PlaylistTrackController] Get List")]
        public void Get_All_Test()
        {
            var result = _PlaylistTrackController.GetAllList() as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = result.Value as List<PlaylistTrack>;
            model.Count.Should().BeGreaterThan(0);
        }

        [Fact(DisplayName = "[PlaylistTrackController] Insert")]
        public void Insert_Invoice_Test()
        {
            var playlistTrack = new PlaylistTrack
            {
                PlaylistId = 101,
                TrackId=2

            };

            var result = _PlaylistTrackController.Post(playlistTrack) as ObjectResult;
            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = Convert.ToInt32(result.Value);
            model.Should().Be(101);

        }

        [Fact(DisplayName = "[PlaylistTrackController] Update")]
        public void Update_Invoice_Test()
        {
            var currentInvoiceprueba = _unitMocked.PlaylistTracks.GetById(5);

            var playlistTrack = new PlaylistTrack
            {
                PlaylistId = 5,
                TrackId = 2

            };

            var result = _PlaylistTrackController.Put(playlistTrack) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = result.Value?.GetType().GetProperty("Message").GetValue(result.Value);
            model.Should().Be("The playlistTrack is Updated");

            var currentInvoice = _unitMocked.PlaylistTracks.GetById(5);
            currentInvoice.Should().NotBeNull();
            currentInvoice.PlaylistId.Should().Be(playlistTrack.PlaylistId);

        }

        [Fact(DisplayName = "[PlaylistTrackController] Delete")]
        public void Delete_Invoice_Test()
        {
            var playlistTrack = 5;

            var result = _PlaylistTrackController.Delete(playlistTrack) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = Convert.ToBoolean(result.Value);
            model.Should().BeTrue();

            var currentInvoice = _unitMocked.PlaylistTracks.GetById(5);
            currentInvoice.Should().BeNull();
        }

        [Fact(DisplayName = "[PlaylistTrackController] Get By Id")]
        public void GetById_Invoice_Test()
        {
            var result = _PlaylistTrackController.GetById(5) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = result.Value as PlaylistTrack;
            model.Should().NotBeNull();
            model.PlaylistId.Should().BeGreaterThan(0);
        }
    }
}
