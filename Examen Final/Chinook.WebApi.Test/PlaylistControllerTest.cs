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
    public class PlaylistControllerTest
    {
        private PlaylistController _PlaylistController;

        private readonly IUnitOfWork _unitMocked;

        public PlaylistControllerTest()
        {
            var unitMocked = new UnitOfWorkMoqData();
            _unitMocked = unitMocked.GetInstante();
            _PlaylistController = new PlaylistController(_unitMocked);
        }

        [Fact(DisplayName = "[PlaylistController] Get List")]
        public void Get_All_Test()
        {
            var result = _PlaylistController.GetAllList() as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = result.Value as List<Playlist>;
            model.Count.Should().BeGreaterThan(0);
        }

        [Fact(DisplayName = "[PlaylistController] Insert")]
        public void Insert_Invoice_Test()
        {
            var playlist = new Playlist
            {
                PlaylistId = 101,
                Name= "Music"
            };

            var result = _PlaylistController.Post(playlist) as ObjectResult;
            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = Convert.ToInt32(result.Value);
            model.Should().Be(101);

        }

        [Fact(DisplayName = "[PlaylistController] Update")]
        public void Update_Invoice_Test()
        {
            var currentInvoiceprueba = _unitMocked.Playlists.GetById(5);

            var playlist = new Playlist
            {
                PlaylistId = 5,
                Name = "Movies"
            };

            var result = _PlaylistController.Put(playlist) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = result.Value?.GetType().GetProperty("Message").GetValue(result.Value);
            model.Should().Be("The Playlist is Updated");

            var currentInvoice = _unitMocked.Playlists.GetById(5);
            currentInvoice.Should().NotBeNull();
            currentInvoice.PlaylistId.Should().Be(playlist.PlaylistId);

        }

        [Fact(DisplayName = "[PlaylistController] Delete")]
        public void Delete_Invoice_Test()
        {
            var playlist = 5;

            var result = _PlaylistController.Delete(playlist) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = Convert.ToBoolean(result.Value);
            model.Should().BeTrue();

            var currentInvoice = _unitMocked.Playlists.GetById(5);
            currentInvoice.Should().BeNull();
        }

        [Fact(DisplayName = "[PlaylistController] Get By Id")]
        public void GetById_Invoice_Test()
        {
            var result = _PlaylistController.GetById(5) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = result.Value as Playlist;
            model.Should().NotBeNull();
            model.PlaylistId.Should().BeGreaterThan(0);
        }
    }
}
